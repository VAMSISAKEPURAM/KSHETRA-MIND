import os
import json
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(env_path)

logger = logging.getLogger("llm_service")

class LLMService:
    """
    Groq / Grok LLM Reasoning Service for KshetraMind AI.
    Executes deep multi-agent agronomic synthesis and reasoning using high-speed models:
    - openai/gpt-oss-120b (120B Flagship Reasoning Model)
    - llama-3.3-70b-versatile (Multilingual Agricultural Reasoning)
    - deepseek-r1-distill-llama-70b (Specialized reasoning model)
    - openai/gpt-oss-20b (Ultra-fast 20B model)
    - llama-3.1-8b-instant (Ultra-low latency)
    """

    DEFAULT_MODEL = "openai/gpt-oss-120b"

    SUPPORTED_MODELS = [
        {
            "id": "openai/gpt-oss-120b",
            "name": "GPT-OSS 120B Reasoning Flagship",
            "description": "Massive 120-Billion parameter advanced agronomic reasoning engine on Groq LPU",
            "recommended": True,
            "speed": "Fast (~220 tps)",
            "context_window": 128000
        },
        {
            "id": "openai/gpt-oss-20b",
            "name": "GPT-OSS 20B High-Speed",
            "description": "20-Billion parameter high-throughput reasoning model on Groq LPU",
            "recommended": False,
            "speed": "Very Fast (~450 tps)",
            "context_window": 128000
        },
        {
            "id": "llama-3.3-70b-versatile",
            "name": "Llama 3.3 70B Versatile",
            "description": "State-of-the-art multilingual agricultural reasoning and agronomic synthesis",
            "recommended": False,
            "speed": "Very Fast (~280 tps)",
            "context_window": 128000
        },
        {
            "id": "deepseek-r1-distill-llama-70b",
            "name": "DeepSeek R1 Distill Llama 70B",
            "description": "High-capability reasoning and agronomic diagnostic chain-of-thought",
            "recommended": False,
            "speed": "Fast (~250 tps)",
            "context_window": 128000
        },
        {
            "id": "llama-3.1-8b-instant",
            "name": "Llama 3.1 8B Instant",
            "description": "Ultra-low latency lightweight model for instant advice",
            "recommended": False,
            "speed": "Blazing (~560 tps)",
            "context_window": 128000
        }
    ]

    @classmethod
    def get_api_key(cls) -> Optional[str]:
        key = os.environ.get("GROQ_API_KEY") or os.environ.get("GROK_API_KEY")
        if not key:
            env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
            if os.path.exists(env_file):
                load_dotenv(env_file, override=True)
                key = os.environ.get("GROQ_API_KEY") or os.environ.get("GROK_API_KEY")
        return key if (key and key.strip()) else None

    @classmethod
    def get_model_name(cls) -> str:
        model = os.environ.get("GROQ_MODEL")
        if not model:
            env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
            if os.path.exists(env_file):
                load_dotenv(env_file, override=True)
                model = os.environ.get("GROQ_MODEL")
        return model or cls.DEFAULT_MODEL

    @classmethod
    def is_available(cls) -> bool:
        key = cls.get_api_key()
        return bool(key and key.strip())

    @classmethod
    def get_masked_key(cls) -> Optional[str]:
        key = cls.get_api_key()
        if not key:
            return None
        key = key.strip()
        if len(key) <= 8:
            return "gsk_••••"
        return f"{key[:6]}••••{key[-4:]}"

    @classmethod
    def get_status(cls) -> Dict[str, Any]:
        return {
            "provider": "Groq Cloud LLM",
            "is_available": cls.is_available(),
            "active_model": cls.get_model_name(),
            "has_api_key": bool(cls.get_api_key()),
            "masked_key": cls.get_masked_key(),
            "supported_models": cls.SUPPORTED_MODELS,
            "fallback_engine": "KshetraMind Multi-Agent Agricultural Synthesis (Local Rules)"
        }

    @classmethod
    def set_api_key(cls, key: str, model: Optional[str] = None):
        """Allows dynamically configuring API key at runtime."""
        os.environ["GROQ_API_KEY"] = key.strip()
        if model:
            os.environ["GROQ_MODEL"] = model.strip()
        # Also write/update backend/.env
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        try:
            lines = []
            if os.path.exists(env_path):
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        if not line.startswith("GROQ_API_KEY=") and not line.startswith("GROQ_MODEL="):
                            lines.append(line.strip())
            lines.append(f"GROQ_API_KEY={key.strip()}")
            if model:
                lines.append(f"GROQ_MODEL={model.strip()}")
            with open(env_path, "w", encoding="utf-8") as f:
                f.write("\n".join(lines) + "\n")
        except Exception as e:
            logger.warning(f"Could not persist .env: {e}")

    @classmethod
    async def test_connection(cls, api_key: Optional[str] = None, model: Optional[str] = None) -> Dict[str, Any]:
        """Tests live connection to Groq API and measures roundtrip latency."""
        key = api_key or cls.get_api_key()
        if not key or not key.strip():
            return {
                "success": False,
                "error": "No Groq API key configured. Provide an API key to enable Groq LLM."
            }
        
        target_model = model or cls.get_model_name()
        import time
        start_t = time.perf_counter()
        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=key.strip())
            resp = await client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a test ping agent."},
                    {"role": "user", "content": "Respond with 'pong'"}
                ],
                model=target_model,
                max_tokens=10,
                temperature=0.0
            )
            elapsed_ms = round((time.perf_counter() - start_t) * 1000)
            content = resp.choices[0].message.content.strip()
            return {
                "success": True,
                "model": target_model,
                "latency_ms": elapsed_ms,
                "reply": content,
                "message": f"Groq LLM ({target_model}) connected successfully in {elapsed_ms}ms!"
            }
        except Exception as e:
            elapsed_ms = round((time.perf_counter() - start_t) * 1000)
            return {
                "success": False,
                "error": str(e),
                "latency_ms": elapsed_ms
            }

    @classmethod
    async def reason_and_synthesize(
        cls,
        query: str,
        language: str,
        farmer_context: Dict[str, Any],
        findings: Dict[str, Any],
        agents_invoked: List[str],
        conversation_history: Optional[List[Dict[str, Any]]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Executes reasoning over multi-agent findings using Groq LLM.
        Returns the structured 5-section response + spoken summary in the requested language.
        Returns None if Groq is not configured or errors out, enabling seamless fallback.
        """
        api_key = cls.get_api_key()
        if not api_key:
            return None

        try:
            from groq import AsyncGroq

            client = AsyncGroq(api_key=api_key)
            model_name = cls.get_model_name()

            language_names = {
                "te": "Telugu (తెలుగు)",
                "hi": "Hindi (हिन्दी)",
                "ta": "Tamil (தமிழ்)",
                "kn": "Kannada (ಕನ್ನಡ)",
                "ml": "Malayalam (മലയാളം)",
                "mr": "Marathi (मराठी)",
                "bn": "Bengali (বাংলা)",
                "en": "English"
            }
            target_lang_label = language_names.get(language, "Telugu (తెలుగు)")

            system_prompt = f"""You are the Central Master Agronomic Reasoning Brain of 'KshetraMind AI' (క్షేత్రమైండ్ AI).
You synthesize verified agricultural observations from specialized sub-agents into practical, localized farmer guidance.

CRITICAL INSTRUCTIONS:
1. Target Language: ALL response fields MUST be written entirely and fluently in {target_lang_label}.
2. Tone: Respectful, scientific, practical, farmer-centric, actionable, encouraging.
3. Structure: You MUST return a valid JSON object matching the exact schema specified below with no extra text or markdown wrapping.
4. Spoken Summary: Provide a 2-sentence conversational, human-like verbal overview in {target_lang_label} suited for Text-to-Speech audio readout.

REQUIRED JSON OUTPUT FORMAT:
{{
  "section_1_understood": "1. What I understood from the farmer query and field situation",
  "section_2_available_info": "2. What the available sub-agent data (weather, pests, market, soil, planning) shows",
  "section_3_next_actions": "3. Numbered actionable steps the farmer can inspect or execute next",
  "section_4_why_matters": "4. Why this matters (cost savings, yield protection, crop health)",
  "section_5_important_caution": "5. Safety warning (avoid indiscriminate pesticide use, consult local KVK/agriculture officer)",
  "spoken_summary": "Concise 2-sentence conversational summary in {target_lang_label} for voice audio playback"
}}"""

            user_payload = {
                "farmer_query": query,
                "target_language": target_lang_label,
                "farmer_profile": {
                    "name": farmer_context.get("name", "Farmer"),
                    "district": farmer_context.get("district", "Warangal"),
                    "current_crop": farmer_context.get("crop", "Chilli"),
                    "soil_type": farmer_context.get("soil_type", "Black Cotton Soil"),
                    "water_source": farmer_context.get("water_source", "Borewell & Drip"),
                    "farm_size": farmer_context.get("farm_size", 2.0)
                },
                "agents_invoked": agents_invoked,
                "sub_agent_findings": findings,
                "recent_conversation_context": conversation_history or []
            }

            chat_completion = await client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False)}
                ],
                model=model_name,
                temperature=0.2,
                max_tokens=1500,
                response_format={"type": "json_object"}
            )

            raw_content = chat_completion.choices[0].message.content
            if not raw_content:
                return None

            parsed = json.loads(raw_content)

            # Ensure all required keys exist
            required_keys = [
                "section_1_understood",
                "section_2_available_info",
                "section_3_next_actions",
                "section_4_why_matters",
                "section_5_important_caution"
            ]
            if not all(k in parsed for k in required_keys):
                return None

            structured = {k: str(parsed[k]) for k in required_keys}
            spoken_summary = str(parsed.get("spoken_summary") or f"{structured['section_1_understood']}. {structured['section_3_next_actions']}")

            return {
                "structured": structured,
                "spoken_summary": spoken_summary,
                "reasoning_model": model_name,
                "provider": "Groq LLM"
            }

        except Exception as e:
            logger.warning(f"Groq LLM reasoning failed or unavailable, falling back to rule synthesis: {e}")
            return None
