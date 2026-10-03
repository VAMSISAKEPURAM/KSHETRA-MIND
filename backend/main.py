import os
import json
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from agents.weather_agent import WeatherAgent
from agents.crop_health_agent import CropHealthAgent
from agents.crop_planning_agent import CropPlanningAgent
from agents.soil_agent import SoilAgent
from agents.market_agent import MarketAgent
from agents.farm_planning_agent import FarmPlanningAgent
from agents.master_agent import MasterAgent
from database.db import get_connection, init_db
from services import LanguageService, STTService, TTSService, ConversationService, LLMService

# Initialize database and tables
init_db()
ConversationService.init_table()

app = FastAPI(
    title="KshetraMind AI Backend API",
    description="Multi-agent agriculture platform backend connecting Weather, Soil, Crop Health, Crop Planning, Market Intelligence, and Farm Planning with Multilingual Voice Assistant.",
    version="1.1.0"
)

# CORS middleware for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "KshetraMind AI Backend API",
        "version": "1.1.0",
        "voice_assistant": "multilingual-whisper-neural-tts",
        "supported_languages": [l["code"] for l in LanguageService.get_supported_languages()],
        "docs": "/docs"
    }

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
    language: Optional[str] = "auto"
    farmer_id: Optional[str] = "farmer-1"
    image_base64: Optional[str] = None
    synthesize_voice: Optional[bool] = False

class VoiceSynthesisRequest(BaseModel):
    text: str
    language: Optional[str] = "te"
    gender: Optional[str] = "female"
    rate: Optional[str] = "+0%"
    pitch: Optional[str] = "+0Hz"

class VoiceAssistantJSONRequest(BaseModel):
    query: str
    language: Optional[str] = "auto"
    farmer_id: Optional[str] = "farmer-1"
    synthesize_voice: Optional[bool] = True

class LLMConfigRequest(BaseModel):
    api_key: Optional[str] = None
    model: Optional[str] = "llama-3.3-70b-versatile"

class TaskUpdate(BaseModel):
    status: str # pending / completed

# --- Health Check ---
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KshetraMind AI Backend",
        "timestamp": datetime.now().isoformat(),
        "languages_supported": [l["code"] for l in LanguageService.get_supported_languages()]
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

# =========================================================================
# --- Multilingual Voice Assistant & Speech Endpoints ---
# =========================================================================

@app.get("/api/voice/languages")
def get_voice_languages():
    """Returns list of supported Indian languages with native scripts and TTS voice profiles."""
    return {
        "status": "success",
        "languages": LanguageService.get_supported_languages()
    }

@app.post("/api/voice/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    preferred_language: Optional[str] = Form("auto")
):
    """
    Speech-to-Text using OpenAI Whisper model.
    Converts user microphone speech to text and automatically identifies the Indian language.
    """
    try:
        content = await audio.read()
        res = await STTService.transcribe(
            audio_data=content,
            filename=audio.filename or "recording.webm",
            preferred_language=preferred_language if preferred_language != "auto" else None
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription error: {str(e)}")

@app.post("/api/voice/synthesize")
async def synthesize_speech(req: VoiceSynthesisRequest):
    """
    Text-to-Speech using high-fidelity Indian neural voices (Edge TTS / Sarvam AI).
    Generates natural audio stream or base64 MP3 for immediate browser playback.
    """
    try:
        res = await TTSService.synthesize(
            text=req.text,
            language=req.language or "te",
            gender=req.gender or "female",
            rate=req.rate or "+0%",
            pitch=req.pitch or "+0Hz"
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech synthesis error: {str(e)}")

@app.get("/api/voice/audio-stream")
async def stream_speech(
    text: str = Query(...),
    language: str = Query("te"),
    gender: str = Query("female")
):
    """
    Direct audio/mpeg binary stream for `<audio>` tags or instant direct streaming.
    """
    try:
        res = await TTSService.synthesize(text=text, language=language, gender=gender)
        if res.get("status") == "success" and "audio_bytes" in res:
            return Response(content=res["audio_bytes"], media_type="audio/mpeg")
        raise HTTPException(status_code=500, detail=res.get("message", "TTS failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming error: {str(e)}")

@app.post("/api/voice/assistant")
async def voice_assistant_pipeline(
    audio: Optional[UploadFile] = File(None),
    query: Optional[str] = Form(None),
    language: Optional[str] = Form("auto"),
    farmer_id: Optional[str] = Form("farmer-1"),
    synthesize_voice: Optional[bool] = Form(True)
):
    """
    Complete end-to-end Multilingual Voice Assistant Pipeline:
    1. Speech Input: Transcribes audio with Whisper (or accepts query text).
    2. Language Detection: Automatically detects Indian language (Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, English).
    3. AI Response Generation: MasterAgent orchestrates Weather, Soil, Crop Health, Market & Farm planning with multi-turn history.
    4. Voice Output: Neural TTS speaks back in the detected language.
    5. Context Persistence: Stores dialogue turn in SQLite database.
    """
    farmer_id_clean = farmer_id or "farmer-1"
    transcribed_text = ""
    detected_lang = language or "auto"
    confidence = 1.0

    # 1. Voice Input / Transcription
    if audio:
        try:
            content = await audio.read()
            stt_res = await STTService.transcribe(
                audio_data=content,
                filename=audio.filename or "recording.webm",
                preferred_language=language if language != "auto" else None
            )
            if stt_res.get("status") == "success":
                transcribed_text = stt_res.get("text", "")
                detected_lang = stt_res.get("detected_language", "te")
                confidence = stt_res.get("confidence", 0.85)
            else:
                return {
                    "status": "error",
                    "error_stage": "stt",
                    "message": stt_res.get("message", "Speech recognition failed"),
                    "detected_language": detected_lang
                }
        except Exception as e:
            return {
                "status": "error",
                "error_stage": "stt",
                "message": f"Microphone audio processing failed: {str(e)}",
                "detected_language": detected_lang
            }
    elif query:
        transcribed_text = query.strip()
        if detected_lang == "auto" or not detected_lang:
            detected_lang = LanguageService.detect_language_from_text(transcribed_text, fallback="te")
    else:
        return {
            "status": "error",
            "message": "Neither audio file nor query text provided"
        }

    if not transcribed_text:
        return {
            "status": "error",
            "error_stage": "stt",
            "message": "No audible speech detected. Please speak clearly into your microphone.",
            "detected_language": detected_lang
        }

    # Normalize detected language code
    normalized_lang = LanguageService.normalize_language_code(detected_lang)
    lang_info = LanguageService.get_language_info(normalized_lang)

    # 2. Fetch Farmer Context
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farmers WHERE id = ?", (farmer_id_clean,))
    row = cursor.fetchone()
    farmer_ctx = dict(row) if row else {
        "name": "Ramesh Rao",
        "district": "Warangal",
        "crop": "Chilli",
        "water_source": "Borewell & Drip",
        "soil_type": "Black Cotton Soil"
    }

    cursor.execute("SELECT current_crop, soil_type, water_source FROM plots WHERE farmer_id = ? LIMIT 1", (farmer_id_clean,))
    plot_row = cursor.fetchone()
    if plot_row:
        farmer_ctx["crop"] = plot_row["current_crop"]
        farmer_ctx["soil_type"] = plot_row["soil_type"]
        farmer_ctx["water_source"] = plot_row["water_source"]
    conn.close()

    # 3. Retrieve recent conversation history for multi-turn context
    history_context = ConversationService.get_recent_context(farmer_id=farmer_id_clean, limit=4)

    # 4. AI Response Generation (MasterAgent)
    agent_result = await MasterAgent.process_farmer_query(
        query=transcribed_text,
        farmer_context=farmer_ctx,
        language=normalized_lang,
        conversation_history=history_context
    )

    structured_resp = agent_result.get("response", {})
    spoken_summary = agent_result.get("spoken_summary", "")
    agents_invoked = agent_result.get("agents_invoked", [])

    # 5. Voice Output (TTS)
    audio_base64 = None
    if synthesize_voice and spoken_summary:
        tts_res = await TTSService.synthesize(
            text=spoken_summary,
            language=normalized_lang
        )
        if tts_res.get("status") == "success":
            audio_base64 = tts_res.get("audio_base64")

    # 6. Save Turn in Conversation History
    try:
        ConversationService.add_turn(
            farmer_id=farmer_id_clean,
            user_text=transcribed_text,
            agent_structured=structured_resp,
            summary_text=spoken_summary,
            language=normalized_lang,
            agents_invoked=agents_invoked
        )
    except Exception as e:
        print(f"Warning: Failed to persist conversation history: {e}")

    return {
        "status": "success",
        "transcription": transcribed_text,
        "detected_language": normalized_lang,
        "language_name": lang_info["name"],
        "native_name": lang_info["native_name"],
        "confidence": confidence,
        "structured_response": structured_resp,
        "spoken_summary": spoken_summary,
        "audio_base64": audio_base64,
        "agents_invoked": agents_invoked,
        "reasoning_engine": agent_result.get("reasoning_engine", "KshetraMind Multi-agent Engine"),
        "timestamp": datetime.now().strftime("%I:%M %p")
    }

# --- Groq LLM Reasoning Endpoints ---
@app.get("/api/llm/status")
def get_llm_status():
    return LLMService.get_status()

@app.post("/api/llm/configure")
async def configure_llm(req: LLMConfigRequest):
    if not req.api_key or not req.api_key.strip():
        raise HTTPException(status_code=400, detail="Groq API key cannot be empty.")
    
    LLMService.set_api_key(req.api_key, req.model)
    test_res = await LLMService.test_connection(req.api_key, req.model)
    return {
        "status": "success" if test_res["success"] else "saved_with_warning",
        "message": "Groq LLM verified & connected!" if test_res["success"] else f"Key saved, but test failed: {test_res.get('error')}",
        "test_result": test_res,
        "llm_status": LLMService.get_status()
    }

@app.post("/api/llm/test")
async def test_llm_connection(req: Optional[LLMConfigRequest] = None):
    key = req.api_key if req else None
    model = req.model if req else None
    return await LLMService.test_connection(api_key=key, model=model)

# --- Voice Conversation History Endpoints ---
@app.get("/api/voice/history/{farmer_id}")
def get_voice_history(farmer_id: str = "farmer-1"):
    return {
        "status": "success",
        "farmer_id": farmer_id,
        "history": ConversationService.get_history(farmer_id=farmer_id, limit=40)
    }

@app.delete("/api/voice/history/{farmer_id}")
def clear_voice_history(farmer_id: str = "farmer-1"):
    ConversationService.clear_history(farmer_id=farmer_id)
    return {"status": "success", "message": f"Conversation history cleared for {farmer_id}"}

# --- Central Master Agent / Assistant Endpoint (Compatible with Existing JSON Calls) ---
@app.post("/api/assistant/ask")
async def ask_master_agent(req: AssistantRequest):
    # Determine language
    lang = req.language
    if not lang or lang == "auto":
        lang = LanguageService.detect_language_from_text(req.query, fallback="te")
    normalized_lang = LanguageService.normalize_language_code(lang)

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

    history = ConversationService.get_recent_context(farmer_id=req.farmer_id or "farmer-1", limit=4)

    result = await MasterAgent.process_farmer_query(
        query=req.query,
        farmer_context=farmer_ctx,
        language=normalized_lang,
        image_base64=req.image_base64,
        conversation_history=history
    )

    audio_base64 = None
    if req.synthesize_voice and result.get("spoken_summary"):
        tts_res = await TTSService.synthesize(text=result["spoken_summary"], language=normalized_lang)
        if tts_res.get("status") == "success":
            audio_base64 = tts_res.get("audio_base64")

    # Persist in conversation history
    try:
        ConversationService.add_turn(
            farmer_id=req.farmer_id or "farmer-1",
            user_text=req.query,
            agent_structured=result.get("response", {}),
            summary_text=result.get("spoken_summary", ""),
            language=normalized_lang,
            agents_invoked=result.get("agents_invoked", [])
        )
    except Exception:
        pass

    result["detected_language"] = normalized_lang
    result["audio_base64"] = audio_base64
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
