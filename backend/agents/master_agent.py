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
        image_base64: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Coordinates specialized agents and synthesizes responses into the 5-point format
        supporting Indian languages (te, hi, ta, kn, ml, mr, bn, en) with conversation context.
        """
        query_lower = query.lower().strip()
        crop = farmer_context.get("crop", "Chilli")
        district = farmer_context.get("district", "Warangal")
        water_source = farmer_context.get("water_source", "Borewell & Drip")
        soil_type = farmer_context.get("soil_type", "Black Cotton Soil")

        # Multi-lingual intent recognition across all 8 Indian languages
        # 1. Weather
        weather_words = [
            "rain", "weather", "forecast", "cloud", "temperature", "humidity", "hot", "cold",
            # Telugu
            "వర్షం", "వాతావరణం", "ఎండ", "తేమ", "చలి", "గాలులు",
            # Hindi
            "बारिश", "मौसम", "तापमान", "धूप", "बादल", "वर्षा",
            # Tamil
            "மழை", "வானிலை", "வெயில்", "ஈரப்பதம்", "குளிர்", "காற்று",
            # Kannada
            "ಮಳೆ", "ಹವಾಮಾನ", "ತಾಪಮಾನ", "ಮೋಡ", "ಬಿಸಿಲು",
            # Malayalam
            "മഴ", "കാലാവസ്ഥ", "ചൂട്", "കാറ്റ്", "മേഘം",
            # Marathi
            "पाऊस", "हवामान", "तापमान", "ढग", "उन",
            # Bengali
            "বৃষ্টি", "আবহাওয়া", "তাপমাত্রা", "মেঘ", "রোদ"
        ]
        is_weather = any(w in query_lower for w in weather_words)

        # 2. Market
        market_words = [
            "price", "mandi", "rate", "cost", "market", "sell", "bhav",
            # Telugu
            "ధర", "మార్కెట్", "రేటు", "మండి", "అమ్మకం",
            # Hindi
            "भाव", "मंडी", "रेट", "दाम", "बाजार", "कीमत",
            # Tamil
            "விலை", "சந்தை", "மண்டை", "விற்பனை", "ரேட்",
            # Kannada
            "ದರ", "ಮಾರುಕಟ್ಟೆ", "ಬೆಲೆ", "ಮಂಡಿ", "ಮಾರಾಟ",
            # Malayalam
            "വില", "വിപണി", "മാർക്കറ്റ്", "നിരക്ക്",
            # Marathi
            "भाव", "बाजार", "दर", "मंडी", "विक्री",
            # Bengali
            "দাম", "বাজার", "দর", "মান্ডি", "বিক্রি"
        ]
        is_market = any(w in query_lower for w in market_words)

        # 3. Crop Health
        health_words = [
            "leaf", "disease", "pest", "yellow", "curl", "spot", "burn", "fungus", "insect", "damage",
            # Telugu
            "ఆకు", "తెగులు", "పురుగు", "ముడత", "మచ్చ", "రంగు", "ఎండిపోవడం",
            # Hindi
            "पत्ती", "रोग", "कीट", "मरोड़िया", "धब्बा", "पीला", "कीड़ा", "बीमारी",
            # Tamil
            "இலை", "நோய்", "பூச்சி", "சுருட்டை", "புள்ளி", "மஞ்சள்", "வண்டு",
            # Kannada
            "ಎಲೆ", "ರೋಗ", "ಕೀಟ", "ಮುರುಟು", "ಚುಕ್ಕೆ", "ಹಳದಿ",
            # Malayalam
            "ഇല", "രോഗം", "കീടം", "പുള്ളി", "മഞ്ഞ", "വാട്ടം",
            # Marathi
            "पान", "रोग", "कीड", "चट्टा", "पिवळे", "मर", "अळी",
            # Bengali
            "পাতা", "রোগ", "পোকা", "দাগ", "হলুদ", "পোকামাকড়"
        ]
        is_health = image_base64 is not None or any(w in query_lower for w in health_words)

        # 4. Crop Planning
        planning_words = [
            "plant", "sow", "which crop", "season", "planning", "kharif", "rabi", "variety",
            # Telugu
            "ఏ పంట", "విత్తనాలు", "ఖరీఫ్", "రబీ", "సాగు", "రకం",
            # Hindi
            "फसल", "बोना", "कौन सी फसल", "बुवाई", "खरीफ", "रबी", "किस्म",
            # Tamil
            "எந்த பயிர்", "விதை", "நடவு", "பருவம்", "விவசாயம்",
            # Kannada
            "ಯಾವ ಬೆಳೆ", "ಬಿತ್ತನೆ", "ಸೀಸನ್", "ತಳಿ",
            # Malayalam
            "ഏത് കൃഷി", "വിത്ത്", "നടീൽ", "സീസൺ",
            # Marathi
            "कोणते पीक", "पेरणी", "हंगाम", "लागवड",
            # Bengali
            "কোন ফসল", "বীজ", "চাষ", "মরশুম"
        ]
        is_planning = any(w in query_lower for w in planning_words)

        # 5. Soil & Fertilizer
        soil_words = [
            "soil", "fertilizer", "urea", "ph", "nutrient", "dap", "potash", "manure",
            # Telugu
            "నేల", "ఎరువు", "యూరియా", "రసాయనం", "డీఏపీ", "పోషకాలు", "భూమి",
            # Hindi
            "मिट्टी", "खाद", "यूरिया", "डीएपी", "पोषक", "जमीन", "उर्वरक",
            # Tamil
            "மண்", "உரம்", "யூரியா", "டிஏபி", "சத்து", "பூமி",
            # Kannada
            "ಮಣ್ಣು", "ಗೊಬ್ಬರ", "ಯೂರಿಯಾ", "ಪೋಷಕಾಂಶ", "ರಸಗೊಬ್ಬರ",
            # Malayalam
            "മണ്ണ്", "വളം", "യൂറിയ", "പോഷകം",
            # Marathi
            "माती", "खत", "युरिया", "डीएपी", "पोषक", "जमीन",
            # Bengali
            "মাটি", "সার", "ইউরিয়া", "পুষ্টি", "জমি"
        ]
        is_soil = any(w in query_lower for w in soil_words)

        # 6. Farm Tasks
        task_words = [
            "task", "today", "work", "schedule", "todo",
            # Telugu
            "చేయాలి", "పని", "షెడ్యూల్", "ఈరోజు",
            # Hindi
            "काम", "करना है", "शेड्यूल", "आज",
            # Tamil
            "வேலை", "செய்ய வேண்டும்", "திட்டம்", "இன்று",
            # Kannada
            "ಕಾರ್ಯ", "ಕೆಲಸ", "ಮಾಡಬೇಕು", "ಇಂದು",
            # Malayalam
            "ജോലി", "ചെയ്യണം", "ഇന്ന്",
            # Marathi
            "काम", "करायचे", "आज",
            # Bengali
            "কাজ", "করতে হবে", "আজ"
        ]
        is_task = any(w in query_lower for w in task_words)

        # If no specific intent matched, default to general farm context
        if not any([is_weather, is_market, is_health, is_planning, is_soil, is_task]):
            is_weather = True
            is_task = True

        selected_agents = []
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

        # Multi-lingual synthesis and reasoning
        # Check if Groq LLM is available for deep agronomic reasoning
        from services.llm_service import LLMService

        synthesis = None
        reasoning_engine = "KshetraMind Multi-agent Engine"
        if LLMService.is_available():
            llm_result = await LLMService.reason_and_synthesize(
                query=query,
                language=language,
                farmer_context=farmer_context,
                findings=combined_findings,
                agents_invoked=selected_agents,
                conversation_history=conversation_history
            )
            if llm_result:
                synthesis = llm_result
                reasoning_engine = f"Groq LLM ({llm_result.get('reasoning_model', 'llama-3.3-70b-versatile')})"

        if not synthesis:
            synthesis = cls._synthesize_5_parts(
                query=query,
                language=language,
                crop=crop,
                district=district,
                findings=combined_findings,
                selected_agents=selected_agents,
                conversation_history=conversation_history
            )

        return {
            "orchestrator": "KshetraMind Central Master Agent",
            "reasoning_engine": reasoning_engine,
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
            "response": synthesis["structured"],
            "spoken_summary": synthesis["spoken_summary"]
        }

    @classmethod
    def _synthesize_5_parts(
        cls,
        query: str,
        language: str,
        crop: str,
        district: str,
        findings: Dict[str, Any],
        selected_agents: List[str],
        conversation_history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Creates the mandatory 5 structured sections + concise spoken summary in the requested language:
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

        # -------------------------------------------------------------
        # 1. TELUGU (తెలుగు)
        # -------------------------------------------------------------
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
                info_bullets.append("నేల & పోషకాలు: సేంద్రీయ కర్బనం మరియు నత్రజని సమతుల్యత అవసరం.")
            if p_data:
                info_bullets.append(f"పంట ప్రణాళిక: {district} ప్రాంతంలో ప్రస్తుత నీరు మరియు నేల ఆధారంగా అనుకూలమైన పంటలు సిఫార్సు చేయబడ్డాయి.")

            info_shows = " ".join(info_bullets) if info_bullets else f"లభ్యమైన తాజా సమాచారం ప్రకారం మీ {crop} తోట సాధారణ స్థితిలో ఉంది."
            next_steps = "1. పొలంలో నీటి నిల్వ లేకుండా చూసుకోండి. 2. ఆకుల అడుగు భాగాన ముడత లేదా రసం పీల్చే పురుగులను గమనించండి. 3. వర్ష సూచన పరిశీలించిన తర్వాతే ఎరువులు లేదా రసాయనాలు పిచికారీ చేయండి."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "సమయానికి సరైన నిర్ణయం తీసుకోవడం వల్ల అనవసర ఖర్చులు తగ్గుతాయి, పంట నాణ్యత మరియు దిగుబడి రక్షించబడతాయి."
            caution = "గమనిక: ఈ సలహా లభ్యమైన శాస్త్రీయ సమాచారం ఆధారంగా అందించబడింది. అధిక మోతాదులో రసాయన మందులు పిచికారీ చేయకండి. తుది నిర్ణయానికి స్థానిక వ్యవసాయ అధికారి (KVK / RBK) ని సంప్రదించండి."

            spoken_summary = f"మీ {crop} పంటకు సంబంధించి తాజా సమాచారం సిద్ధంగా ఉంది. {info_shows[:140]}. పిచికారీకి ముందు వాతావరణం పరిశీలించండి."

        # -------------------------------------------------------------
        # 2. HINDI (हिन्दी)
        # -------------------------------------------------------------
        elif language == "hi":
            understood = f"आपने '{query}' और {district} जिले में अपनी {crop} फसल के संबंध में पूछा है।"
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"मौसम: तापमान {cur.get('temperature')}°C, आर्द्रता {cur.get('humidity')}%, बारिश की संभावना {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"फसल स्वास्थ्य: {h_data.get('scientific_and_local_name')}. मुख्य लक्षण: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"मंडी भाव: {top_m.get('market')} में मॉडल भाव ₹{top_m.get('modal_price'):,}/क्विंटल ({top_m.get('observation_date')}).")
            if s_data:
                info_bullets.append("मृदा स्वास्थ्य: जैविक कार्बन और पोषक तत्वों की स्थिति को संतुलित रखें।")
            if p_data:
                info_bullets.append(f"फसल योजना: {district} के लिए उपयुक्त फसलें मूल्यांकित की गई हैं।")

            info_shows = " ".join(info_bullets) if info_bullets else f"उपलब्ध जानकारी के अनुसार आपकी {crop} की स्थिति सामान्य है।"
            next_steps = "1. खेत में जलभराव न होने दें। 2. पत्तियों की निचली सतह पर कीटों की जांच करें। 3. वर्षा पूर्वानुमान देखकर ही छिड़काव करें।"
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "समय पर उचित प्रबंधन से अनावश्यक खर्च घटता है और फसल की उपज सुरक्षित रहती है।"
            caution = "सावधानी: यह सलाह उपलब्ध वैज्ञानिक आंकड़ों पर आधारित है। अत्यधिक कीटनाशकों का प्रयोग न करें। नजदीकी कृषि विज्ञान केंद्र (KVK) से सलाह लें।"

            spoken_summary = f"आपकी {crop} फसल के लिए जानकारी तैयार है। {info_shows[:140]}. छिड़काव से पहले मौसम का ध्यान रखें।"

        # -------------------------------------------------------------
        # 3. TAMIL (தமிழ்)
        # -------------------------------------------------------------
        elif language == "ta":
            understood = f"நீங்கள் '{query}' மற்றும் {district} மாவட்டத்தில் உள்ள உங்கள் {crop} பயிர் குறித்து கேட்டுள்ளீர்கள்."
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"வானிலை தகவல்: வெப்பநிலை {cur.get('temperature')}°C, ஈரப்பதம் {cur.get('humidity')}%, மழை வாய்ப்பு {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"பயிர் ஆரோக்கியம்: {h_data.get('scientific_and_local_name')}. முக்கிய அறிகுறி: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"சந்தை விலை: {top_m.get('market')} சந்தையில் மாதிரி விலை ₹{top_m.get('modal_price'):,}/குவிண்டால் ({top_m.get('observation_date')}).")
            if s_data:
                info_bullets.append("மண் நலம்: அங்ககக் கரிமம் மற்றும் ஊட்டச்சத்துக்களை சமநிலையில் பராமரிக்கவும்.")
            if p_data:
                info_bullets.append(f"பயிர் திட்டம்: {district} பகுதிக்கு ஏற்ற பயிர்கள் பரிந்துரைக்கப்பட்டுள்ளன.")

            info_shows = " ".join(info_bullets) if info_bullets else f"கிடைக்கப்பெற்ற தகவலின்படி உங்கள் {crop} பயிர் இயல்பு நிலையில் உள்ளது."
            next_steps = "1. வயலில் தண்ணீர் தேங்காமல் பார்த்துக் கொள்ளுங்கள். 2. இலைகளின் அடிப்பகுதியில் சாறு உறிஞ்சும் பூச்சிகள் உள்ளதா என கவனிக்கவும். 3. மழை முன்னறிவிப்பை கவனித்து மருந்து தெளிக்கவும்."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "சரியான நேரத்தில் நடவடிக்கை எடுப்பது தேவையற்ற செலவைக் குறைத்து மகசூலை பாதுகாக்கும்."
            caution = "எச்சரிக்கை: இந்த ஆலோசனை வேளாண்மை முடிவெடுக்கும் நோக்கத்திற்காக மட்டுமே. அருகிலுள்ள வேளாண் அறிவியல் மையத்தை (KVK) அணுகவும்."

            spoken_summary = f"உங்கள் {crop} பயிர் பற்றிய விவரங்கள் தயாராக உள்ளன. {info_shows[:140]}. தெளிப்பதற்கு முன் வானிலையை கவனிக்கவும்."

        # -------------------------------------------------------------
        # 4. KANNADA (ಕನ್ನಡ)
        # -------------------------------------------------------------
        elif language == "kn":
            understood = f"ನೀವು '{query}' ಮತ್ತು {district} ಜಿಲ್ಲೆಯಲ್ಲಿ ನಿಮ್ಮ {crop} ಬೆಳೆಯ ಕುರಿತು ವಿಚಾರಿಸಿದ್ದೀರಿ."
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"ಹವಾಮಾನ: ತಾಪಮಾನ {cur.get('temperature')}°C, ತೇವಾಂಶ {cur.get('humidity')}%, ಮಳೆ ಸಂಭವನೀಯತೆ {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"ಬೆಳೆ ಆರೋಗ್ಯ: {h_data.get('scientific_and_local_name')}. ಮುಖ್ಯ ಲಕ್ಷಣ: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"ಮಾರುಕಟ್ಟೆ ದರ: {top_m.get('market')} ಮಂಡಿಯಲ್ಲಿ ಬೆಲೆ ₹{top_m.get('modal_price'):,}/ಕ್ವಿಂಟಾಲ್ ({top_m.get('observation_date')}).")
            if s_data:
                info_bullets.append("ಮಣ್ಣು ಮತ್ತು ಪೋಷಕಾಂಶಗಳು: ಸಮತೋಲಿತ ಗೊಬ್ಬರ ನಿರ್ವಹಣೆಗೆ ಸಲಹೆ ನೀಡಲಾಗಿದೆ.")
            if p_data:
                info_bullets.append(f"ಬೆಳೆ ಯೋಜನೆ: {district} ಪ್ರದೇಶಕ್ಕೆ ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ.")

            info_shows = " ".join(info_bullets) if info_bullets else f"ಲಭ್ಯವಿರುವ ಮಾಹಿತಿಯಂತೆ ನಿಮ್ಮ {crop} ಬೆಳೆ ಸಹಜ ಸ್ಥಿತಿಯಲ್ಲಿದೆ."
            next_steps = "1. ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ವ್ಯವಸ್ಥೆ ಮಾಡಿ. 2. ಎಲೆಗಳ ಹಿಂಬದಿಯಲ್ಲಿ ಕೀಟ ಪರೀಕ್ಷಿಸಿ. 3. ಮಳೆ ಮುನ್ಸೂಚನೆ ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಸಿಂಪಡಣೆ ಮಾಡಿ."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ಕೈಗೊಂಡ ಕ್ರಮವು ಅನಗತ್ಯ ಖರ್ಚನ್ನು ಉಳಿಸಿ, ಉತ್ತಮ ಬೆಳೆ ಇಳುವರಿ ಕಾಪಾಡುತ್ತದೆ."
            caution = "ಎಚ್ಚರಿಕೆ: ಇದು ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ. ಅತಿಯಾದ ಕೀಟನಾಶಕಗಳನ್ನು ಸಿಂಪಡಿಸಬೇಡಿ. ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ."

            spoken_summary = f"ನಿಮ್ಮ {crop} ಬೆಳೆಗೆ ಸಂಬಂಧಿಸಿದ ಮಾಹಿತಿ ಸಿದ್ಧವಾಗಿದೆ. {info_shows[:140]}. ಸಿಂಪಡಣೆಗೆ ಮುನ್ನ ಹವಾಮಾನ ಗಮನಿಸಿ."

        # -------------------------------------------------------------
        # 5. MALAYALAM (മലയാളം)
        # -------------------------------------------------------------
        elif language == "ml":
            understood = f"നിങ്ങൾ '{query}' എന്നതിനെക്കുറിച്ചും {district} ജില്ലയിലെ നിങ്ങളുടെ {crop} കൃഷിയെക്കുറിച്ചും ചോദിച്ചു."
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"കാലാവസ്ഥ: താപനില {cur.get('temperature')}°C, ഈർപ്പം {cur.get('humidity')}%, മഴ സാധ്യത {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"വിള ആരോഗ്യം: {h_data.get('scientific_and_local_name')}. പ്രധാന ലക്ഷണം: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"വിപണി നിരക്ക്: {top_m.get('market')} ൽ ശരാശരി വില ക്വിന്റലിന് ₹{top_m.get('modal_price'):,} ({top_m.get('observation_date')}).")
            if s_data:
                info_bullets.append("മണ്ണ് ആരോഗ്യം: ജൈവ കാർബണും പോഷകങ്ങളും സന്തുലിതമായി നിലനിർത്തുക.")
            if p_data:
                info_bullets.append(f"വിള ആസൂത്രണം: {district} ജില്ലയ്ക്ക് അനുയോജ്യമായ വിളകൾ കണ്ടെത്തിയിട്ടുണ്ട്.")

            info_shows = " ".join(info_bullets) if info_bullets else f"ലഭ്യമായ വിവരമനുസരിച്ച് നിങ്ങളുടെ {crop} കൃഷി സാധാരണ നിലയിലാണ്."
            next_steps = "1. കൃഷിയിടത്തിൽ വെള്ളം കെട്ടിക്കിടക്കാൻ അനുവദിക്കരുത്. 2. ഇലകളുടെ അടിയിൽ കീടബാധ പരിശോധിക്കുക. 3. മഴ പ്രവചനം കണ്ട് മരുന്ന് തളിക്കുക."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "കൃത്യസമയത്തുള്ള പരിചരണം അനാവശ്യ ചെലവുകൾ കുറയ്ക്കുകയും വിളവ് ഉറപ്പാക്കുകയും ചെയ്യും."
            caution = "മുന്നറിയിപ്പ്: ഇത് ശാസ്ത്രീയ വിവരങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. അമിതമായ കീടനാശിനി പ്രയോഗം ഒഴിവാക്കുക. കൃഷിഭവനുമായി ബന്ധപ്പെടുക."

            spoken_summary = f"നിങ്ങളുടെ {crop} കൃഷിയെക്കുറിച്ചുള്ള വിവരങ്ങൾ ലഭ്യമാണ്. {info_shows[:140]}. മരുന്ന് തളിക്കുന്നതിന് മുമ്പ് മഴ പരിശോധിക്കുക."

        # -------------------------------------------------------------
        # 6. MARATHI (मराठी)
        # -------------------------------------------------------------
        elif language == "mr":
            understood = f"तुम्ही '{query}' आणि {district} जिल्ह्यातील तुमच्या {crop} पिकाबाबत विचारले आहे."
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"हवामान: तापमान {cur.get('temperature')}°C, आर्द्रता {cur.get('humidity')}%, पावसाची शक्यता {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"पीक आरोग्य: {h_data.get('scientific_and_local_name')}. मुख्य लक्षण: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"बाजार भाव: {top_m.get('market')} बाजारात मॉडेल भाव ₹{top_m.get('modal_price'):,}/क्विंटल ({top_m.get('observation_date')}).")
            if s_data:
                info_bullets.append("जमीन व खते: सेंद्रिय कर्ब आणि खतांचे संतुलित व्यवस्थापन आवश्यक आहे.")
            if p_data:
                info_bullets.append(f"पीक नियोजन: {district} साठी योग्य पिकांची शिफारस केली आहे.")

            info_shows = " ".join(info_bullets) if info_bullets else f"उपलब्ध माहितीनुसार तुमच्या {crop} पिकाची स्थिती समाधानकारक आहे."
            next_steps = "1. शेतात पाणी साचू देऊ नका. 2. पानांच्या खाली कीड किंवा रोगाची लक्षणे तपासा. 3. पावसाचा अंदाज पाहूनच फवारणी करा."
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "वेळेवर योग्य व्यवस्थापन केल्यास अनावश्यक खर्च वाचतो आणि पिकाचे उत्पादन वाढते."
            caution = "सूचना: हा सल्ला उपलब्ध कृषी आकडेवारीवर आधारित आहे. प्रमाणाबाहेर कीटकनाशके वापरू नका. स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या."

            spoken_summary = f"तुमच्या {crop} पिकाविषयी माहिती उपलब्ध आहे. {info_shows[:140]}. फवारणीपूर्वी पावसाचा अंदाज नक्की तपासा."

        # -------------------------------------------------------------
        # 7. BENGALI (বাংলা)
        # -------------------------------------------------------------
        elif language == "bn":
            understood = f"আপনি '{query}' এবং {district} জেলায় আপনার {crop} ফসলের বিষয়ে জানতে চেয়েছেন।"
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"আবহাওয়া: তাপমাত্রা {cur.get('temperature')}°C, আর্দ্রতা {cur.get('humidity')}%, বৃষ্টির সম্ভাবনা {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"ফসলের স্বাস্থ্য: {h_data.get('scientific_and_local_name')}. প্রধান লক্ষণ: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"বাজার দর: {top_m.get('market')} মান্ডিতে গড় দর ₹{top_m.get('modal_price'):,}/কুইন্টাল ({top_m.get('observation_date')}).")
            if s_data:
                info_bullets.append("মাটি ও পুষ্টি: জৈব কার্বন এবং সারের সুষম ব্যবহার প্রয়োজন।")
            if p_data:
                info_bullets.append(f"ফসল পরিকল্পনা: {district} অঞ্চলের জন্য উপযুক্ত ফসলের পরামর্শ দেওয়া হয়েছে।")

            info_shows = " ".join(info_bullets) if info_bullets else f"উপলব্ধ তথ্য অনুযায়ী আপনার {crop} ফসলের অবস্থা স্বাভাবিক।"
            next_steps = "1. জমিতে অতিরিক্ত জল জমতে দেবেন না। 2. পাতার নিচে পোকা বা রোগের লক্ষণ পরীক্ষা করুন। 3. বৃষ্টির পূর্বাভাস দেখে স্প্রে করুন।"
            if h_data and h_data.get("general_prevention_guidance"):
                next_steps = "1. " + "; 2. ".join(h_data["general_prevention_guidance"][:2])

            why_matters = "সময়মতো সঠিক ব্যবস্থা নিলে অহেতুক খরচ কমে এবং ফসলের ফলন সুরক্ষিত থাকে।"
            caution = "সতর্কতা: এই পরামর্শ কৃষকদের সহায়তার জন্য। অতিরিক্ত রাসায়নিক সার বা কীটনাশক প্রয়োগ করবেন না। স্থানীয় কৃষি আধিকারিকের পরামর্শ নিন।"

            spoken_summary = f"আপনার {crop} ফসলের জন্য তথ্য প্রস্তুত। {info_shows[:140]}. স্প্রে করার আগে আবহাওয়ার পূর্বাভাস দেখে নিন।"

        # -------------------------------------------------------------
        # 8. ENGLISH (en)
        # -------------------------------------------------------------
        else:
            understood = f"You asked about '{query}' regarding your {crop} crop in {district} district."
            info_bullets = []
            if w_data:
                cur = w_data.get("current", {})
                info_bullets.append(f"Weather Context: Temperature {cur.get('temperature')}°C, Humidity {cur.get('humidity')}%, Rain Probability {cur.get('rain_probability')}%. {w_data.get('farm_advisory', {}).get('key_message', '')}")
            if h_data:
                info_bullets.append(f"Crop Health Observation: {h_data.get('scientific_and_local_name')}. Primary symptom: {h_data.get('main_visual_symptoms')}")
            if m_data and m_data.get("markets"):
                top_m = m_data["markets"][0]
                info_bullets.append(f"Market Intel: {top_m.get('market')} modal price ₹{top_m.get('modal_price'):,}/Q on {top_m.get('observation_date')}.")
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

            spoken_summary = f"Here is the latest insight for your {crop} crop in {district}. {info_shows[:140]}. Always check the weather radar before scheduling field spray."

        return {
            "structured": {
                "section_1_understood": understood,
                "section_2_available_info": info_shows,
                "section_3_next_actions": next_steps,
                "section_4_why_matters": why_matters,
                "section_5_important_caution": caution
            },
            "spoken_summary": spoken_summary
        }
