import os
import json
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.weather_agent import WeatherAgent
from agents.crop_health_agent import CropHealthAgent
from agents.crop_planning_agent import CropPlanningAgent
from agents.soil_agent import SoilAgent
from agents.market_agent import MarketAgent
from agents.farm_planning_agent import FarmPlanningAgent
from agents.master_agent import MasterAgent
from database.db import get_connection, init_db

# Initialize database
init_db()

app = FastAPI(
    title="KshetraMind AI Backend API",
    description="Multi-agent agriculture platform backend connecting Weather, Soil, Crop Health, Crop Planning, Market Intelligence, and Farm Planning.",
    version="1.0.0"
)

# CORS middleware for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class FarmerCreate(BaseModel):
    id: Optional[str] = None
    name: str
    state: str
    district: str
    village: Optional[str] = ""
    preferred_language: str = "te"
    farm_size: float = 2.0
    farm_size_unit: str = "Acres"
    water_source: Optional[str] = "Borewell & Drip"
    soil_type: Optional[str] = "Black Cotton Soil"

class PlotCreate(BaseModel):
    farmer_id: str
    plot_name: str
    size: float
    current_crop: str
    crop_variety: Optional[str] = ""
    planting_date: Optional[str] = None
    growth_stage: Optional[str] = "Vegetative"
    water_source: Optional[str] = "Borewell"
    soil_type: Optional[str] = "Black Cotton Soil"

class SoilEvaluateRequest(BaseModel):
    ph: Optional[float] = None
    nitrogen: Optional[str] = "Medium"
    phosphorus: Optional[str] = "Medium"
    potassium: Optional[str] = "High"
    organic_carbon: Optional[float] = 0.55
    soil_type: Optional[str] = "Black Cotton Soil"
    crop: Optional[str] = "Chilli"

class CropPlanRequest(BaseModel):
    district: str = "Warangal"
    season: str = "Kharif"
    water_source: str = "Borewell & Drip"
    soil_type: str = "Black Cotton Soil"
    farm_size_acres: float = 3.0

class AssistantRequest(BaseModel):
    query: str
    language: str = "te"
    farmer_id: Optional[str] = "farmer-1"
    image_base64: Optional[str] = None

class TaskUpdate(BaseModel):
    status: str # pending / completed

# --- Health Check ---
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KshetraMind AI Backend",
        "timestamp": datetime.now().isoformat(),
        "languages_supported": ["te", "en", "hi", "kn"]
    }

# --- Farmer Profile Endpoints ---
@app.get("/api/farmer/{farmer_id}")
def get_farmer_profile(farmer_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farmers WHERE id = ?", (farmer_id,))
    row = cursor.fetchone()
    if not row:
        # Fallback to default
        cursor.execute("SELECT * FROM farmers LIMIT 1")
        row = cursor.fetchone()
    
    farmer_data = dict(row) if row else {}
    
    # Get plots
    cursor.execute("SELECT * FROM plots WHERE farmer_id = ?", (farmer_id,))
    plots = [dict(r) for r in cursor.fetchall()]
    farmer_data["plots"] = plots
    
    conn.close()
    return farmer_data

@app.post("/api/farmer")
def save_farmer_profile(farmer: FarmerCreate):
    conn = get_connection()
    cursor = conn.cursor()
    f_id = farmer.id or f"farmer-{uuid.uuid4().hex[:6]}"
    
    cursor.execute("""
    INSERT INTO farmers (id, name, state, district, village, preferred_language, farm_size, farm_size_unit, water_source, soil_type, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        state = excluded.state,
        district = excluded.district,
        village = excluded.village,
        preferred_language = excluded.preferred_language,
        farm_size = excluded.farm_size,
        farm_size_unit = excluded.farm_size_unit,
        water_source = excluded.water_source,
        soil_type = excluded.soil_type,
        updated_at = CURRENT_TIMESTAMP
    """, (f_id, farmer.name, farmer.state, farmer.district, farmer.village, farmer.preferred_language, farmer.farm_size, farmer.farm_size_unit, farmer.water_source, farmer.soil_type))
    
    conn.commit()
    conn.close()
    return {"status": "success", "id": f_id, "message": "Farmer profile saved successfully"}

# --- Plots Endpoints ---
@app.get("/api/plots")
def list_plots(farmer_id: str = "farmer-1"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM plots WHERE farmer_id = ?", (farmer_id,))
    plots = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return plots

@app.post("/api/plots")
def add_plot(plot: PlotCreate):
    conn = get_connection()
    cursor = conn.cursor()
    plot_id = f"plot-{uuid.uuid4().hex[:6]}"
    cursor.execute("""
    INSERT INTO plots (id, farmer_id, plot_name, size, current_crop, crop_variety, planting_date, growth_stage, water_source, soil_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (plot_id, plot.farmer_id, plot.plot_name, plot.size, plot.current_crop, plot.crop_variety, plot.planting_date or datetime.now().strftime("%Y-%m-%d"), plot.growth_stage, plot.water_source, plot.soil_type))
    conn.commit()
    conn.close()
    return {"status": "success", "id": plot_id}

# --- Weather Agent Endpoint ---
@app.get("/api/weather")
async def get_weather(district: str = "Warangal", crop: Optional[str] = "Chilli"):
    return await WeatherAgent.get_weather(district=district, crop=crop)

# --- Crop Health Agent Endpoint ---
@app.post("/api/crop-health/analyze")
async def analyze_crop_health(
    crop: str = Form("Chilli"),
    image: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(None)
):
    image_data = None
    image_name = None
    if image:
        content = await image.read()
        image_name = image.filename
        image_data = f"data:{image.content_type};base64," + str(uuid.uuid4())
    
    result = await CropHealthAgent.analyze_leaf(crop=crop, image_data=image_data, image_name=image_name, notes=notes)
    
    # Save log to DB
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO crop_health_logs (id, farmer_id, crop, diagnosed_issue, confidence, symptoms, recommendations, expert_consult_recommended)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (f"scan-{uuid.uuid4().hex[:6]}", "farmer-1", crop, result["diagnosed_issue"], result["confidence_score"], result["main_visual_symptoms"], json.dumps(result["general_prevention_guidance"]), 1 if result["expert_consult_recommended"] else 0))
    conn.commit()
    conn.close()
    
    return result

# --- Market Intelligence Endpoint ---
@app.get("/api/mandi-prices")
def get_mandi_prices(
    commodity: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None
):
    return MarketAgent.get_market_prices(commodity=commodity, state=state, district=district)

# --- Soil & Nutrient Guidance Endpoint ---
@app.post("/api/soil/evaluate")
def evaluate_soil(req: SoilEvaluateRequest):
    return SoilAgent.evaluate_soil(
        ph=req.ph,
        nitrogen=req.nitrogen,
        phosphorus=req.phosphorus,
        potassium=req.potassium,
        organic_carbon=req.organic_carbon,
        soil_type=req.soil_type,
        crop=req.crop
    )

# --- Crop Planning Endpoint ---
@app.post("/api/crop-planning")
def plan_crops(req: CropPlanRequest):
    return CropPlanningAgent.plan_crops(
        district=req.district,
        season=req.season,
        water_source=req.water_source,
        soil_type=req.soil_type,
        farm_size_acres=req.farm_size_acres
    )

# --- Farm Tasks Endpoints ---
@app.get("/api/tasks")
def get_tasks(farmer_id: str = "farmer-1", crop: Optional[str] = "Chilli"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farm_tasks WHERE farmer_id = ? ORDER BY due_date ASC", (farmer_id,))
    rows = cursor.fetchall()
    tasks = [dict(r) for r in rows]
    if not tasks:
        # Generate default schedule
        tasks = FarmPlanningAgent.generate_schedule(crop=crop or "Chilli")
    conn.close()
    return tasks

@app.put("/api/tasks/{task_id}")
def update_task_status(task_id: str, update: TaskUpdate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE farm_tasks SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?
    """, (update.status, task_id))
    conn.commit()
    conn.close()
    return {"status": "success", "task_id": task_id}

# --- Farm Alerts Endpoints ---
@app.get("/api/alerts")
def get_alerts(farmer_id: str = "farmer-1"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farm_alerts WHERE farmer_id = ? ORDER BY created_at DESC", (farmer_id,))
    rows = cursor.fetchall()
    alerts = [dict(r) for r in rows]
    conn.close()
    return alerts

@app.put("/api/alerts/{alert_id}/read")
def mark_alert_read(alert_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE farm_alerts SET is_read = 1 WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}

# --- Central Master Agent / Assistant Endpoint ---
@app.post("/api/assistant/ask")
async def ask_master_agent(req: AssistantRequest):
    # Fetch farmer context
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farmers WHERE id = ?", (req.farmer_id or "farmer-1",))
    row = cursor.fetchone()
    farmer_ctx = dict(row) if row else {
        "name": "Ramesh Rao",
        "district": "Warangal",
        "crop": "Chilli",
        "water_source": "Borewell & Drip",
        "soil_type": "Black Cotton Soil"
    }
    
    # Fetch latest plot for crop info
    cursor.execute("SELECT current_crop, soil_type, water_source FROM plots WHERE farmer_id = ? LIMIT 1", (req.farmer_id or "farmer-1",))
    plot_row = cursor.fetchone()
    if plot_row:
        farmer_ctx["crop"] = plot_row["current_crop"]
        farmer_ctx["soil_type"] = plot_row["soil_type"]
        farmer_ctx["water_source"] = plot_row["water_source"]
        
    conn.close()

    result = await MasterAgent.process_farmer_query(
        query=req.query,
        farmer_context=farmer_ctx,
        language=req.language or "te",
        image_base64=req.image_base64
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
