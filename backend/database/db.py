import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "kshetramind.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Farmers table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS farmers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        village TEXT,
        preferred_language TEXT NOT NULL DEFAULT 'te',
        farm_size REAL,
        farm_size_unit TEXT DEFAULT 'Acres',
        water_source TEXT,
        soil_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Plots table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS plots (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        plot_name TEXT NOT NULL,
        size REAL,
        current_crop TEXT NOT NULL,
        crop_variety TEXT,
        planting_date TEXT,
        growth_stage TEXT,
        water_source TEXT,
        soil_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
    )
    """)
    
    # Soil tests
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS soil_tests (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        plot_id TEXT,
        ph REAL,
        nitrogen TEXT,
        phosphorus TEXT,
        potassium TEXT,
        organic_carbon REAL,
        test_date TEXT,
        laboratory_name TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
    )
    """)
    
    # Crop health scans
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crop_health_logs (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        plot_id TEXT,
        crop TEXT NOT NULL,
        image_path TEXT,
        diagnosed_issue TEXT NOT NULL,
        confidence REAL,
        symptoms TEXT,
        recommendations TEXT,
        expert_consult_recommended INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
    )
    """)
    
    # Farm tasks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS farm_tasks (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        plot_id TEXT,
        stage TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
    )
    """)
    
    # Alerts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS farm_alerts (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        alert_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT DEFAULT 'info',
        source TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
    )
    """)
    
    # Seed default sample farmer if empty
    cursor.execute("SELECT COUNT(*) FROM farmers")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO farmers (id, name, state, district, village, preferred_language, farm_size, farm_size_unit, water_source, soil_type)
        VALUES ('farmer-1', 'Ramesh Rao', 'Telangana', 'Warangal', 'Narsampet', 'te', 3.5, 'Acres', 'Borewell & Drip', 'Black Cotton Soil')
        """)
        cursor.execute("""
        INSERT INTO plots (id, farmer_id, plot_name, size, current_crop, crop_variety, planting_date, growth_stage, water_source, soil_type)
        VALUES ('plot-1', 'farmer-1', 'North Plot (ఉత్తర చేను)', 2.0, 'Chilli', 'Teja Guntur Sannam', '2026-08-10', 'Flowering & Fruiting', 'Borewell & Drip', 'Black Cotton Soil')
        """)
        cursor.execute("""
        INSERT INTO plots (id, farmer_id, plot_name, size, current_crop, crop_variety, planting_date, growth_stage, water_source, soil_type)
        VALUES ('plot-2', 'farmer-1', 'East Plot (తూర్పు చేను)', 1.5, 'Cotton', 'Bollgard II', '2026-07-25', 'Boll Formation', 'Borewell', 'Medium Black Soil')
        """)
        cursor.execute("""
        INSERT INTO farm_tasks (id, farmer_id, plot_id, stage, title, description, due_date, status, priority)
        VALUES 
        ('task-1', 'farmer-1', 'plot-1', 'Flowering & Fruiting', 'Inspect for Thrips / Leaf Curl', 'Inspect underside of young leaves for curling or silken webbing early morning.', '2026-10-01', 'pending', 'high'),
        ('task-2', 'farmer-1', 'plot-1', 'Flowering & Fruiting', 'Foliar Micro-nutrient Spray', 'Spray 19:19:19 (5g/L) or formula-4 micronutrients after checking rain forecast.', '2026-10-03', 'pending', 'medium'),
        ('task-3', 'farmer-1', 'plot-2', 'Crop Protection', 'Pheromone Trap Check', 'Count bollworm moths caught in yellow sticky and funnel traps.', '2026-10-02', 'pending', 'high'),
        ('task-4', 'farmer-1', 'plot-1', 'Early Growth', 'Weeding & Intercultural operations', 'Manual weeding along plant rows completed.', '2026-09-15', 'completed', 'medium')
        """)
        cursor.execute("""
        INSERT INTO farm_alerts (id, farmer_id, alert_type, title, description, severity, source)
        VALUES 
        ('alert-1', 'farmer-1', 'weather', 'Precipitation Advisory', 'Light scattered rain (45% probability) forecast in Warangal rural within 36 hours. Postpone foliar spraying.', 'warning', 'IMD / Open-Meteo Weather Radar'),
        ('alert-2', 'farmer-1', 'pest', 'Thrips & Mite Surveillance', 'High humidity (78%) in Warangal district creates favorable environment for sucking pests in chilli.', 'warning', 'KVK Warangal Advisory'),
        ('alert-3', 'farmer-1', 'market', 'Chilli Mandi Price Surge', 'Warangal Enumamula market modal price touched ₹16,800/Q for Teja variety on Sep 29.', 'info', 'Agmarknet Market Yard')
        """)
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
