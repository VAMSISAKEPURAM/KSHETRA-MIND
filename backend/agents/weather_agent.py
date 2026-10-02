import httpx
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Pre-mapped Indian district coordinates
DISTRICT_COORDINATES = {
    "Warangal": {"lat": 17.9689, "lon": 79.5941, "state": "Telangana"},
    "Nizamabad": {"lat": 18.6725, "lon": 78.0941, "state": "Telangana"},
    "Karimnagar": {"lat": 18.4386, "lon": 79.1288, "state": "Telangana"},
    "Suryapet": {"lat": 17.1439, "lon": 79.6239, "state": "Telangana"},
    "Guntur": {"lat": 16.3067, "lon": 80.4365, "state": "Andhra Pradesh"},
    "Kurnool": {"lat": 15.8281, "lon": 78.0373, "state": "Andhra Pradesh"},
    "Chittoor": {"lat": 13.2172, "lon": 79.1003, "state": "Andhra Pradesh"},
    "Kolar": {"lat": 13.1367, "lon": 78.1291, "state": "Karnataka"},
    "Belagavi": {"lat": 15.8497, "lon": 74.4977, "state": "Karnataka"},
    "Raichur": {"lat": 16.2120, "lon": 77.3439, "state": "Karnataka"},
    "Davanagere": {"lat": 14.4644, "lon": 75.9218, "state": "Karnataka"},
    "Nagpur": {"lat": 21.1458, "lon": 79.0882, "state": "Maharashtra"},
    "Agra": {"lat": 27.1767, "lon": 78.0081, "state": "Uttar Pradesh"},
}

WEATHER_CODE_DESCRIPTIONS = {
    0: "Clear sky (స్వచ్ఛమైన ఆకాశం / साफ आसमान / ಸ್ಪಷ್ಟ ಆಕಾಶ)",
    1: "Mainly clear (ఎక్కువగా స్వచ్ఛమైన ఆకాశం / मुख्य रूप से साफ / ಬಹುತೇಕ ಸ್ಪಷ್ಟ)",
    2: "Partly cloudy (పాక్షికంగా మేఘావృతం / आंशिक रूप से बादल / ಭಾಗಶಃ ಮೋಡ)",
    3: "Overcast (దట్టమైన మేఘాలు / बादल छाए हुए / ದಟ್ಟ ಮೋಡ)",
    45: "Foggy (పొగమంచు / कोहरा / ಮಂಜು ಕವಿದ)",
    51: "Light drizzle (తేలికపాటి జల్లులు / हल्की बूंदाबांदी / ತಿಳಿ ಹನಿಮಳೆ)",
    61: "Slight rain (తేలికపాటి వర్షం / हल्की बारिश / ಹಗುರ ಮಳೆ)",
    63: "Moderate rain (మితమైన వర్షం / मध्यम बारिश / ಮಧ್ಯಮ ಮಳೆ)",
    65: "Heavy rain (భారీ వర్షం / भारी बारिश / ಭಾರಿ ಮಳೆ)",
    80: "Rain showers (వర్షపు జల్లులు / बौछारें / ಮಳೆಯ ಸಿಂಚನ)",
    95: "Thunderstorm (ఉరుములతో కూడిన వర్షం / गरज के साथ बारिश / ಗುಡುಗು ಸಹಿತ ಮಳೆ)"
}

class WeatherAgent:
    name = "Weather Agent"
    description = "Provides live meteorological data, 7-day precipitation forecasts, and farm spraying/irrigation advisories."

    @staticmethod
    def get_coordinates(district: str) -> Dict[str, Any]:
        cleaned = district.strip().title()
        for d_name, coords in DISTRICT_COORDINATES.items():
            if d_name.lower() in cleaned.lower() or cleaned.lower() in d_name.lower():
                return coords
        # Default to Warangal
        return DISTRICT_COORDINATES["Warangal"]

    @classmethod
    async def get_weather(cls, district: str = "Warangal", crop: Optional[str] = None) -> Dict[str, Any]:
        coords = cls.get_coordinates(district)
        lat = coords["lat"]
        lon = coords["lon"]
        state = coords.get("state", "India")
        
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&"
            f"daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&"
            f"timezone=Asia%2FKolkata&forecast_days=7"
        )
        
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    daily = data.get("daily", {})
                    
                    temp = current.get("temperature_2m", 28.5)
                    humidity = current.get("relative_humidity_2m", 72)
                    wind_speed = current.get("wind_speed_10m", 12.0)
                    wcode = current.get("weather_code", 1)
                    
                    # 7-day forecast items
                    forecast = []
                    dates = daily.get("time", [])
                    max_temps = daily.get("temperature_2m_max", [])
                    min_temps = daily.get("temperature_2m_min", [])
                    precip_probs = daily.get("precipitation_probability_max", [])
                    wcodes = daily.get("weather_code", [])
                    
                    for i in range(min(7, len(dates))):
                        forecast.append({
                            "date": dates[i],
                            "max_temp": max_temps[i] if i < len(max_temps) else 32,
                            "min_temp": min_temps[i] if i < len(min_temps) else 22,
                            "precipitation_probability": precip_probs[i] if i < len(precip_probs) else 20,
                            "weather_code": wcodes[i] if i < len(wcodes) else 1,
                            "condition": WEATHER_CODE_DESCRIPTIONS.get(wcodes[i] if i < len(wcodes) else 1, "Clear")
                        })
                    
                    rain_prob_today = forecast[0]["precipitation_probability"] if forecast else 25
                    
                    # Farm Advisory based on conditions
                    advisory = cls._generate_farm_advisory(temp, humidity, rain_prob_today, crop)
                    
                    return {
                        "is_live": True,
                        "source": "Open-Meteo Global Model / Regional IMD Grid",
                        "district": district,
                        "state": state,
                        "latitude": lat,
                        "longitude": lon,
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M IST"),
                        "current": {
                            "temperature": temp,
                            "humidity": humidity,
                            "wind_speed_kmh": wind_speed,
                            "weather_code": wcode,
                            "condition": WEATHER_CODE_DESCRIPTIONS.get(wcode, "Partly Cloudy"),
                            "rain_probability": rain_prob_today
                        },
                        "forecast": forecast,
                        "farm_advisory": advisory
                    }
        except Exception as e:
            # Safe Fallback with explicit demonstration mode
            return cls._get_demo_weather(district, state, lat, lon, crop, str(e))

    @classmethod
    def _generate_farm_advisory(cls, temp: float, humidity: float, rain_prob: int, crop: Optional[str]) -> Dict[str, Any]:
        spray_safe = rain_prob < 40 and humidity < 85
        irrigation_needed = rain_prob < 30 and temp > 30
        
        considerations = []
        if rain_prob >= 40:
            considerations.append("High chance of rain: Avoid foliar pesticide or urea top-dressing to prevent chemical wash-off and runoff.")
        else:
            considerations.append("Dry window: Suitable for light irrigation and necessary crop scouting.")
            
        if humidity > 75:
            considerations.append("Elevated relative humidity: Inspect crop foliage for early signs of fungal leaf spots or powdery mildew.")
            
        if temp > 34:
            considerations.append("High daytime heat: Irrigate during cooler early morning or late evening hours to reduce evaporation stress.")

        return {
            "spray_safe": spray_safe,
            "irrigation_recommended": irrigation_needed,
            "rain_alert": rain_prob >= 50,
            "key_message": considerations[0] if considerations else "Normal weather conditions for routine farm activities.",
            "all_considerations": considerations
        }

    @classmethod
    def _get_demo_weather(cls, district: str, state: str, lat: float, lon: float, crop: Optional[str], err: str) -> Dict[str, Any]:
        return {
            "is_live": False,
            "demo_mode": True,
            "source": "Sample Meteorological Forecast (Demonstration Mode - API offline)",
            "district": district,
            "state": state,
            "latitude": lat,
            "longitude": lon,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M IST"),
            "current": {
                "temperature": 29.4,
                "humidity": 68,
                "wind_speed_kmh": 11.5,
                "weather_code": 2,
                "condition": "Partly cloudy (పాక్షికంగా మేఘావృతం)",
                "rain_probability": 30
            },
            "forecast": [
                {"date": "Day 1", "max_temp": 32, "min_temp": 23, "precipitation_probability": 30, "condition": "Partly cloudy"},
                {"date": "Day 2", "max_temp": 31, "min_temp": 22, "precipitation_probability": 45, "condition": "Scattered drizzle"},
                {"date": "Day 3", "max_temp": 33, "min_temp": 24, "precipitation_probability": 20, "condition": "Sunny"},
                {"date": "Day 4", "max_temp": 34, "min_temp": 24, "precipitation_probability": 15, "condition": "Clear sky"},
                {"date": "Day 5", "max_temp": 32, "min_temp": 23, "precipitation_probability": 25, "condition": "Partly cloudy"},
                {"date": "Day 6", "max_temp": 30, "min_temp": 22, "precipitation_probability": 40, "condition": "Light rain"},
                {"date": "Day 7", "max_temp": 31, "min_temp": 23, "precipitation_probability": 35, "condition": "Overcast"}
            ],
            "farm_advisory": {
                "spray_safe": True,
                "irrigation_recommended": False,
                "rain_alert": False,
                "key_message": "Sample weather: Monitor field moisture before scheduling borewell irrigation.",
                "all_considerations": [
                    "Check soil root-zone moisture before operating pumps.",
                    "Foliar spray can proceed if no rain is sighted in immediate local horizon."
                ]
            }
        }
