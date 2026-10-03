import io
import os
import asyncio
import logging
import tempfile
from typing import Dict, Any, Optional, Tuple

from .language_service import LanguageService

logger = logging.getLogger("stt_service")

class STTService:
    """
    Speech-to-Text service powered by OpenAI Whisper (via faster-whisper).
    Performs automatic language detection across Indian languages:
    Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, English.
    """

    _model = None
    _model_name = "base" # "base" gives high accuracy and low latency on CPU
    _lock = asyncio.Lock()

    @classmethod
    def get_model(cls):
        """Lazy loads the Whisper model singleton."""
        if cls._model is None:
            try:
                from faster_whisper import WhisperModel
                logger.info(f"Loading faster-whisper model ({cls._model_name}) on CPU...")
                cls._model = WhisperModel(
                    cls._model_name,
                    device="cpu",
                    compute_type="int8",
                    cpu_threads=4,
                    num_workers=1
                )
                logger.info("Whisper model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load Whisper model: {e}")
                raise e
        return cls._model

    @classmethod
    async def transcribe(
        cls,
        audio_data: bytes,
        filename: Optional[str] = "audio.webm",
        preferred_language: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Transcribes audio bytes asynchronously and automatically detects the spoken language.
        Returns transcribed text, detected language code, language name, and confidence score.
        """
        if not audio_data or len(audio_data) < 100:
            return {
                "status": "error",
                "message": "Audio data is empty or too short",
                "text": "",
                "detected_language": preferred_language or "te",
                "language_name": LanguageService.get_language_info(preferred_language or "te")["name"],
                "confidence": 0.0
            }

        # Run transcription in a background thread to prevent blocking FastAPI event loop
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            None,
            cls._transcribe_sync,
            audio_data,
            filename,
            preferred_language
        )

    @classmethod
    def _transcribe_sync(
        cls,
        audio_data: bytes,
        filename: Optional[str] = "audio.webm",
        preferred_language: Optional[str] = None
    ) -> Dict[str, Any]:
        temp_path = None
        try:
            model = cls.get_model()

            # Save temporary file with proper extension for PyAV / faster-whisper
            ext = os.path.splitext(filename or "audio.webm")[1] or ".webm"
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f:
                f.write(audio_data)
                temp_path = f.name

            # Transcribe with automatic language identification
            # If preferred_language is explicitly provided and not "auto", provide hint
            whisper_lang = None
            if preferred_language and preferred_language != "auto":
                whisper_lang = LanguageService.normalize_language_code(preferred_language)

            segments, info = model.transcribe(
                temp_path,
                language=whisper_lang,
                beam_size=5,
                vad_filter=True, # Voice Activity Detection removes silence
                vad_parameters=dict(min_silence_duration_ms=500)
            )

            text_segments = [s.text.strip() for s in segments]
            full_text = " ".join(text_segments).strip()

            detected_lang_whisper = info.language if info else (preferred_language or "te")
            confidence = info.language_probability if info else 0.85

            # Cross-verify detected language with script analysis of transcribed text
            normalized_lang = LanguageService.normalize_language_code(detected_lang_whisper)
            if full_text:
                script_detected_lang = LanguageService.detect_language_from_text(full_text, fallback=normalized_lang)
                if script_detected_lang in LanguageService.SUPPORTED_LANGUAGES:
                    normalized_lang = script_detected_lang

            lang_info = LanguageService.get_language_info(normalized_lang)

            return {
                "status": "success",
                "text": full_text,
                "detected_language": normalized_lang,
                "language_name": lang_info["name"],
                "native_name": lang_info["native_name"],
                "confidence": round(float(confidence), 2),
                "duration": round(float(info.duration), 2) if info and hasattr(info, "duration") else 0.0
            }

        except Exception as e:
            logger.error(f"Error during audio transcription: {e}")
            return {
                "status": "error",
                "message": f"Transcription failed: {str(e)}",
                "text": "",
                "detected_language": preferred_language or "te",
                "language_name": LanguageService.get_language_info(preferred_language or "te")["name"],
                "confidence": 0.0
            }
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
