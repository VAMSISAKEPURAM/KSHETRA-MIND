import os
import re
import io
import base64
import logging
import hashlib
from typing import Dict, Any, Optional

import httpx
import edge_tts
from .language_service import LanguageService

logger = logging.getLogger("tts_service")

class TTSService:
    """
    Multilingual Text-to-Speech service supporting Indian languages:
    Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, English.

    Uses Edge-TTS with Neural Indian voices as primary high-fidelity free engine,
    with Sarvam AI API integration if SARVAM_API_KEY is configured in the environment.
    """

    # In-memory audio cache: MD5(lang + text + voice) -> audio_bytes
    _cache: Dict[str, bytes] = {}
    _MAX_CACHE_ITEMS = 100

    @classmethod
    def clean_text_for_speech(cls, text: str) -> str:
        """
        Cleans Markdown asterisks, headers, bullets, and links so TTS produces smooth spoken audio.
        """
        if not text:
            return ""
        # Remove bold/italic markdown
        cleaned = re.sub(r"[*_~`]", "", text)
        # Remove headers
        cleaned = re.sub(r"^#+\s*", "", cleaned, flags=re.MULTILINE)
        # Remove markdown links [text](url) -> text
        cleaned = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", cleaned)
        # Remove bullet symbols
        cleaned = re.sub(r"^[•\-\*]\s*", "", cleaned, flags=re.MULTILINE)
        # Remove multiple newlines and spaces
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    @classmethod
    async def synthesize(
        cls,
        text: str,
        language: str = "te",
        gender: str = "female",
        rate: str = "+0%",
        pitch: str = "+0Hz"
    ) -> Dict[str, Any]:
        """
        Synthesizes text to MP3 audio bytes and base64 data URI.
        """
        cleaned_text = cls.clean_text_for_speech(text)
        if not cleaned_text:
            return {
                "status": "error",
                "message": "Text is empty",
                "audio_base64": "",
                "format": "mp3"
            }

        normalized_lang = LanguageService.normalize_language_code(language)
        cache_key = hashlib.md5(f"{normalized_lang}:{gender}:{cleaned_text[:100]}".encode("utf-8")).hexdigest()

        if cache_key in cls._cache:
            audio_bytes = cls._cache[cache_key]
            b64_str = base64.b64encode(audio_bytes).decode("utf-8")
            return {
                "status": "success",
                "format": "mp3",
                "audio_base64": f"data:audio/mp3;base64,{b64_str}",
                "audio_bytes": audio_bytes,
                "cached": True
            }

        # 1. Try Sarvam AI if API key is present
        sarvam_key = os.environ.get("SARVAM_API_KEY")
        if sarvam_key:
            try:
                sarvam_audio = await cls._synthesize_sarvam(cleaned_text, normalized_lang, sarvam_key)
                if sarvam_audio:
                    cls._save_cache(cache_key, sarvam_audio)
                    b64_str = base64.b64encode(sarvam_audio).decode("utf-8")
                    return {
                        "status": "success",
                        "provider": "Sarvam AI",
                        "format": "wav",
                        "audio_base64": f"data:audio/wav;base64,{b64_str}",
                        "audio_bytes": sarvam_audio
                    }
            except Exception as e:
                logger.warning(f"Sarvam AI TTS failed, falling back to Edge TTS: {e}")

        # 2. Free Neural Edge TTS (Default zero-config solution)
        try:
            audio_bytes = await cls._synthesize_edge_tts(cleaned_text, normalized_lang, gender, rate, pitch)
            cls._save_cache(cache_key, audio_bytes)
            b64_str = base64.b64encode(audio_bytes).decode("utf-8")
            return {
                "status": "success",
                "provider": "Edge Neural TTS",
                "format": "mp3",
                "audio_base64": f"data:audio/mp3;base64,{b64_str}",
                "audio_bytes": audio_bytes
            }
        except Exception as e:
            logger.error(f"TTS synthesis failed: {e}")
            return {
                "status": "error",
                "message": f"TTS synthesis failed: {str(e)}",
                "audio_base64": "",
                "format": "mp3"
            }

    @classmethod
    async def _synthesize_edge_tts(
        cls,
        text: str,
        language: str,
        gender: str = "female",
        rate: str = "+0%",
        pitch: str = "+0Hz"
    ) -> bytes:
        lang_info = LanguageService.get_language_info(language)
        voice = lang_info.get("tts_voice_male" if gender == "male" else "tts_voice")
        if not voice:
            voice = "te-IN-ShrutiNeural"

        # Truncate text to reasonable length if excessively long for speech (e.g. 500 chars)
        speech_text = text if len(text) <= 500 else text[:497] + "..."

        communicate = edge_tts.Communicate(
            text=speech_text,
            voice=voice,
            rate=rate,
            pitch=pitch
        )

        audio_chunks = []
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_chunks.append(chunk["data"])

        return b"".join(audio_chunks)

    @classmethod
    async def _synthesize_sarvam(cls, text: str, language: str, api_key: str) -> Optional[bytes]:
        """Optional Sarvam AI TTS integration."""
        lang_map = {
            "te": "te-IN", "hi": "hi-IN", "ta": "ta-IN", "kn": "kn-IN",
            "ml": "ml-IN", "mr": "mr-IN", "bn": "bn-IN", "en": "en-IN"
        }
        sarvam_lang = lang_map.get(language, "te-IN")

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://api.sarvam.ai/text-to-speech",
                headers={
                    "api-subscription-key": api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "inputs": [text[:500]],
                    "target_language_code": sarvam_lang,
                    "speaker": "meera",
                    "model": "bulbul:v1"
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                audios = data.get("audios", [])
                if audios:
                    return base64.b64decode(audios[0])
        return None

    @classmethod
    def _save_cache(cls, key: str, audio: bytes):
        if len(cls._cache) >= cls._MAX_CACHE_ITEMS:
            # Drop oldest key
            oldest = next(iter(cls._cache))
            del cls._cache[oldest]
        cls._cache[key] = audio
