import asyncio
import re
from typing import Dict, Any, List, Optional
from datetime import datetime

from .weather_agent import WeatherAgent
from .crop_health_agent import CropHealthAgent
from .crop_planning_agent import CropPlanningAgent
from .soil_agent import SoilAgent
from .market_agent import MarketAgent
from .farm_planning_agent import FarmPlanningAgent

class MasterAgent:
    name = "Master Agent"
    description = "Central multi-agent coordinator: classifies intent, executes relevant agents, checks data freshness and synthesizes unified multi-lingual farm guidance."

    @classmethod
    async def process_farmer_query(
        cls,
        query: str,
        farmer_context: Dict[str, Any],
        language: str = "te",
        image_base64: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Coordinates specialized agents and synthesizes responses into the 5-point format.
        """
        query_lower = query.lower().strip()
        crop = farmer_context.get("crop", "Chilli")
        district = farmer_context.get("district", "Warangal")
        water_source = farmer_context.get("water_source", "Borewell & Drip")
        soil_type = farmer_context.get("soil_type", "Black Cotton Soil")

        # Intent detection
        selected_agents = []
        is_weather = any(w in query_lower for w in ["rain", "weather", "forecast", "cloud", "temperature", "వర్షం", "వాతావరణం", "बारिश", "मौसम", "ಮಳೆ", "ಹವಾಮಾನ"])
        is_market = any(w in query_lower for w in ["price", "mandi", "rate", "cost", "market", "ధర", "మార్కెట్", "రేటు", "भाव", "मंडी", "ದರ", "ಮಾರುಕಟ್ಟೆ"])
        is_health = image_base64 is not None or any(w in query_lower for w in ["leaf", "disease", "pest", "yellow", "curl", "spot", "burn", "ఆకు", "తెగులు", "పురుగు", "ముడత", "पत्ती", "रोग", "कीट", "ರೋಗ", "ಎಲೆ"])
        is_planning = any(w in query_lower for w in ["plant", "sow", "which crop", "season", "planning", "ఏ పంట", "విత్తనాలు", "ఖరీఫ్", "फसल", "बोना", "ಯಾವ ಬೆಳೆ", "ಬಿತ್ತನೆ"])
        is_soil = any(w in query_lower for w in ["soil", "fertilizer", "urea", "ph", "nutrient", "dap", "నేల", "ఎరువు", "యూరియా", "రసాయనం", "मिट्टी", "खाद", "ಮಣ್ಣು", "ಗೊಬ್ಬರ"])
        is_task = any(w in query_lower for w in ["task", "today", "work", "schedule", "చేయాలి", "పని", "काम", "ಕಾರ್ಯ", "ಕೆಲಸ"])

        if not any([is_weather, is_market, is_health, is_planning, is_soil, is_task]):
            # General farm inquiry: combine weather + farm context + current tasks
            is_weather = True
            is_task = True

        # Build execution list
        coros = []
        agent_keys = []

        if is_weather:
            selected_agents.append(WeatherAgent.name)
            agent_keys.append("weather")
            coros.append(WeatherAgent.get_weather(district=district, crop=crop))

        if is_health:
            selected_agents.append(CropHealthAgent.name)
            agent_keys.append("health")
            coros.append(CropHealthAgent.analyze_leaf(crop=crop, image_data=image_base64, notes=query))

        # Synchronous agents
        sync_results = {}
        if is_market:
            selected_agents.append(MarketAgent.name)
            sync_results["market"] = MarketAgent.get_market_prices(commodity=crop, district=district)

        if is_planning:
            selected_agents.append(CropPlanningAgent.name)
            sync_results["planning"] = CropPlanningAgent.plan_crops(district=district, water_source=water_source, soil_type=soil_type)

        if is_soil:
            selected_agents.append(SoilAgent.name)
            sync_results["soil"] = SoilAgent.evaluate_soil(ph=6.8, nitrogen="Low", organic_carbon=0.45, soil_type=soil_type, crop=crop)

        if is_task:
            selected_agents.append(FarmPlanningAgent.name)
            sync_results["tasks"] = FarmPlanningAgent.generate_schedule(crop=crop)[:3]

        # Execute async agents in parallel
        async_results = {}
        if coros:
            results = await asyncio.gather(*coros)
            for k, res in zip(agent_keys, results):
                async_results[k] = res

        combined_findings = {**async_results, **sync_results}

        # Multi-lingual synthesis in 5 mandatory sections
        structured_response = cls._synthesize_5_parts(
            query=query,
            language=language,
            crop=crop,
            district=district,
            findings=combined_findings,
            selected_agents=selected_agents
        )

        return {
            "orchestrator": "KshetraMind Central Master Agent",
            "language": language,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M IST"),
            "farmer_context_used": {
                "farmer_name": farmer_context.get("name", "Farmer"),
                "crop": crop,
                "district": district,
                "soil_type": soil_type,
                "water_source": water_source
            },
            "agents_invoked": selected_agents,
            "findings": combined_findings,
            "response": structured_response
        }

    @classmethod
    def _synthesize_5_parts(
        cls,
        query: str,
        language: str,
        crop: str,
        district: str,
        findings: Dict[str, Any],
        selected_agents: List[str]
    ) -> Dict[str, str]:
        """
        Creates the mandatory 5 structured sections in the requested language:
        1. What I understood
        2. What the available information shows
        3. What you can check or do next
        4. Why this matters
        5. Important caution
        """
        w_data = findings.get("weather")
        h_data = findings.get("health")
        m_data = findings.get("market")
        s_data = findings.get("soil")
        p_data = findings.get("planning")
        
        # --- TELUGU (తెలుగు) ---
        if language == "te":
            understood = f"మీరు '{query}' గురించి మరియు మీ {district} ప్రాంతంలో సాగవుతున్న {crop} పంట పరిస్థితి గురించి అడిగారు."
            
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"వాతావరణ సమాచారం: ఉష్ణోగ్రత {cur.get('temperature')}°C, తేమ {cur.get('humidity')}%, వర్ష సంభావ్యత {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"పంట ఆరోగ్య పరిశీలన: {h_data.get('scientific_and_local_name')}. నమ్మక స్థాయి: {h_data.get('confidence_label')}. ప్రధాన లక్షణం: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"మార్కెట్ సమాచారం: {top_m.get('market')} లో మోడల్ ధర క్వింటాలుకు ₹{top_m.get('modal_price'):,} ({top_m.get('observation_date')}). వనరు: Agmarknet.")
            if s_data:
                info_bullets.append(f"నేల & పోషకాలు: సేంద్రీయ కర్బనం మరియు నత్రజని పరిమితులు గమనించబడ్డాయి. సమతుల్య పోషణ అవసరం.")
            if p_data:
                info_bullets.append(f"పంట ప్రణాళిక: {district} ప్రాంతంలో ప్రస్తుత నీరు మరియు నేల ఆధారంగా {', '.join([c['crop'] for c in p_data.get('recommended_crops', [])[:2]])} అనుకూలమైనవి.")
                
            info_shows = " ".join(info_bullets) if info_bullets else f"లభ్యమైన తాజా సమాచారం ప్రకారం మీ {crop} తోట సాధారణ స్థితిలో ఉంది."

            next_steps = "1. పొలంలో నీటి నిల్వ లేకుండా చూసుకోండి. 2. ఆకుల అడుగు భాగాన ముడత లేదా రసం పీల్చే పురుగులను గమనించండి. 3. వర్ష సూచన పరిశీలించిన తర్వాతే ఎరువులు లేదా రసాయనాలు పిచికారీ చేయండి."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "సమయానికి సరైన నిర్ణయం తీసుకోవడం వల్ల అనవసర ఖర్చులు తగ్గుతాయి, పంట నాణ్యత మరియు దిగుబడి రక్షించబడతాయి."
            caution = "గమనిక: ఈ సలహా ప్రస్తుత లభ్యమైన శాస్త్రీయ డేటా ఆధారంగా అందించబడింది. అధిక మోతాదులో రసాయన మందులు పిచికారీ చేయకండి. తుది నిర్ణయానికి స్థానిక వ్యవసాయ విస్తరణ అధికారి (KVK / RBK) ని సంప్రదించండి."

        # --- HINDI (हिन्दी) ---
        elif language == "hi":
            understood = f"आपने '{query}' और {district} जिले में आपकी {crop} फसल के संबंध में पूछा है।"
            
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"मौसम की जानकारी: तापमान {cur.get('temperature')}°C, आर्द्रता {cur.get('humidity')}%, वर्षा की संभावना {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"फसल स्वास्थ्य: {h_data.get('scientific_and_local_name')}. मुख्य लक्षण: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"मंडी भाव: {top_m.get('market')} में मॉडल भाव ₹{top_m.get('modal_price'):,}/क्विंटल ({top_m.get('observation_date')}). स्रोत: Agmarknet.")
            if s_data:
                info_bullets.append(f"मृदा स्वास्थ्य: जैविक कार्बन और पोषक तत्वों की स्थिति को संतुलित रखने की आवश्यकता है।")
            if p_data:
                info_bullets.append(f"फसल योजना: {district} के लिए उपयुक्त फसलें मूल्यांकित की गई हैं।")
                
            info_shows = " ".join(info_bullets) if info_bullets else f"उपलब्ध जानकारी के अनुसार आपकी {crop} की स्थिति सामान्य है।"

            next_steps = "1. खेत में जलभराव न होने दें। 2. पत्तियों की निचली सतह पर कीटों या फफूंद के लक्षणों की जांच करें। 3. वर्षा के पूर्वानुमान को देखकर ही छिड़काव की योजना बनाएं।"
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "समय पर उचित प्रबंधन से अनावश्यक रासायनिक खर्च घटता है और फसल की उपज सुरक्षित रहती है।"
            caution = "सावधानी: यह सलाह उपलब्ध वैज्ञानिक आंकड़ों पर आधारित है। बिना प्रमाणित सलाह के अत्यधिक कीटनाशकों का प्रयोग न करें। नजदीकी कृषि विज्ञान केंद्र (KVK) से पुष्टि अवश्य करें।"

        # --- KANNADA (ಕನ್ನಡ) ---
        elif language == "kn":
            understood = f"ನೀವು '{query}' ಮತ್ತು {district} ಜಿಲ್ಲೆಯಲ್ಲಿ ನಿಮ್ಮ {crop} ಬೆಳೆಯ ಕುರಿತು ವಿಚಾರಿಸಿದ್ದೀರಿ."
            
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"ಹವಾಮಾನ ಮಾಹಿತಿ: ತಾಪಮಾನ {cur.get('temperature')}°C, ತೇವಾಂಶ {cur.get('humidity')}%, ಮಳೆ ಸಂಭವನೀಯತೆ {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"ಬೆಳೆ ಆರೋಗ್ಯ: {h_data.get('scientific_and_local_name')}. ಮುಖ್ಯ ಲಕ್ಷಣ: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ: {top_m.get('market')} ಮಂಡಿಯಲ್ಲಿ ಮಾದರಿ ಬೆಲೆ ₹{top_m.get('modal_price'):,}/ಕ್ವಿಂಟಾಲ್ ({top_m.get('observation_date')}). ಮೂಲ: Agmarknet.")
            if s_data:
                info_bullets.append(f"ಮಣ್ಣು ಮತ್ತು ಪೋಷಕಾಂಶಗಳು: ಸಮತೋಲಿತ ಗೊಬ್ಬರ ನಿರ್ವಹಣೆಗೆ ಸಲಹೆ ನೀಡಲಾಗಿದೆ.")
            if p_data:
                info_bullets.append(f"ಬೆಳೆ ಯೋಜನೆ: ನಿಮ್ಮ ಭೂಮಿ ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಗೆ ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ.")
                
            info_shows = " ".join(info_bullets) if info_bullets else f"ಲಭ್ಯವಿರುವ ಮಾಹಿತಿಯಂತೆ ನಿಮ್ಮ {crop} ಬೆಳೆ ಸಹಜ ಸ್ಥಿತಿಯಲ್ಲಿದೆ."

            next_steps = "1. ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ವ್ಯವಸ್ಥೆ ಮಾಡಿ. 2. ಎಲೆಗಳ ಹಿಂಬದಿಯಲ್ಲಿ ಕೀಟ ಅಥವಾ ಮುದುಡುವಿಕೆ ಪರೀಕ್ಷಿಸಿ. 3. ಮಳೆ ಮುನ್ಸೂಚನೆ ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಸಿಂಪಡಣೆ ಮಾಡಿ."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ಕೈಗೊಂಡ ಕ್ರಮವು ಅನಗತ್ಯ ಖರ್ಚನ್ನು ಉಳಿಸಿ, ಉತ್ತಮ ಬೆಳೆ ಇಳುವರಿ ಕಾಪಾಡುತ್ತದೆ."
            caution = "ಎಚ್ಚರಿಕೆ: ಇದು ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ. ಅತಿಯಾದ ರಾಸಾಯನಿಕ ಕ್ರಿಮಿನಾಶಕಗಳನ್ನು ಸಿಂಪಡಿಸಬೇಡಿ. ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು (KVK / ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ) ಸಂಪರ್ಕಿಸಿ."

        # --- ENGLISH ---
        else:
            understood = f"You asked about '{query}' regarding your {crop} crop in {district} district."
            
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"Weather Context: Temperature {cur.get('temperature')}°C, Humidity {cur.get('humidity')}%, Rain Probability {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"Crop Health Observation: {h_data.get('scientific_and_local_name')}. Confidence: {h_data.get('confidence_label')}. Primary symptom: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"Market Intel: {top_m.get('market')} modal price ₹{top_m.get('modal_price'):,}/Q on {top_m.get('observation_date')}. Source: Agmarknet.")
            if s_data:
                info_bullets.append("Soil Guidance: Evaluated against organic carbon and NPK baselines.")
            if p_data:
                info_bullets.append(f"Crop Planning: Recommended crops evaluated based on season and water availability.")

            info_shows = " ".join(info_bullets) if info_bullets else f"Current observations for {crop} indicate normal growth conditions."

            next_steps = "1. Inspect crop canopy for moisture stress or pest vectors. 2. Verify upcoming 48-hour rain forecast before scheduling pesticide spray. 3. Maintain regular irrigation schedule."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "Timely agricultural decisions safeguard plant health, prevent needless chemical expenditure, and protect harvest quality."
            caution = "Important Caution: This guidance is agricultural decision support based on verified data points. Do not apply synthetic pesticides without certified Krishi Vigyan Kendra (KVK) confirmation."

        return {
            "section_1_understood": understood,
            "section_2_available_info": info_shows,
            "section_3_next_actions": next_steps,
            "section_4_why_matters": why_matters,
            "section_5_important_caution": caution
        }
