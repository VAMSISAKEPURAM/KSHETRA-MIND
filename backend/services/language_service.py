import re
from typing import Dict, Any, List, Optional

class LanguageService:
    """
    Modular language detection and metadata service supporting:
    - Telugu (te)
    - Hindi (hi)
    - Tamil (ta)
    - Kannada (kn)
    - Malayalam (ml)
    - Marathi (mr)
    - Bengali (bn)
    - English (en)
    """

    SUPPORTED_LANGUAGES: Dict[str, Dict[str, str]] = {
        "te": {
            "code": "te",
            "name": "Telugu",
            "native_name": "తెలుగు",
            "locale": "te-IN",
            "tts_voice": "te-IN-ShrutiNeural",
            "tts_voice_male": "te-IN-MohanNeural"
        },
        "hi": {
            "code": "hi",
            "name": "Hindi",
            "native_name": "हिन्दी",
            "locale": "hi-IN",
            "tts_voice": "hi-IN-SwaraNeural",
            "tts_voice_male": "hi-IN-MadhurNeural"
        },
        "ta": {
            "code": "ta",
            "name": "Tamil",
            "native_name": "தமிழ்",
            "locale": "ta-IN",
            "tts_voice": "ta-IN-PallaviNeural",
            "tts_voice_male": "ta-IN-ValluvarNeural"
        },
        "kn": {
            "code": "kn",
            "name": "Kannada",
            "native_name": "ಕನ್ನಡ",
            "locale": "kn-IN",
            "tts_voice": "kn-IN-SapnaNeural",
            "tts_voice_male": "kn-IN-GaganNeural"
        },
        "ml": {
            "code": "ml",
            "name": "Malayalam",
            "native_name": "മലയാളം",
            "locale": "ml-IN",
            "tts_voice": "ml-IN-SobhanaNeural",
            "tts_voice_male": "ml-IN-MidhunNeural"
        },
        "mr": {
            "code": "mr",
            "name": "Marathi",
            "native_name": "मराठी",
            "locale": "mr-IN",
            "tts_voice": "mr-IN-AarohiNeural",
            "tts_voice_male": "mr-IN-ManoharNeural"
        },
        "bn": {
            "code": "bn",
            "name": "Bengali",
            "native_name": "বাংলা",
            "locale": "bn-IN",
            "tts_voice": "bn-IN-TanishaaNeural",
            "tts_voice_male": "bn-IN-BashkarNeural"
        },
        "en": {
            "code": "en",
            "name": "English",
            "native_name": "English",
            "locale": "en-IN",
            "tts_voice": "en-IN-NeerjaNeural",
            "tts_voice_male": "en-IN-PrabhatNeural"
        }
    }

    # Distinctive Marathi words written in Devanagari to differentiate from Hindi
    MARATHI_KEYWORDS = [
        "आहे", "नाही", "शेतकरी", "कसा", "झाले", "करावे", "पाहिजे", "करायचे",
        "सांगा", "पिकांवर", "पिकाचे", "पाऊस", "बाजारभाव", "कशी"
    ]

    # Distinctive Hindi words written in Devanagari
    HINDI_KEYWORDS = [
        "है", "हैं", "हूँ", "होगा", "होगी", "करना", "चाहिए", "किसान",
        "फसल", "मौसम", "बताइए", "कैसे", "क्या", "बारिश", "कीजिए", "दाम"
    ]

    # Romanized colloquial keywords for Indian languages
    ROMAN_KEYWORDS = {
        "te": ["ela", "enti", "varsham", "pantalu", "dharalu", "chudandi", "cheppandi", "raithu", "kavali", "undi"],
        "hi": ["kya", "kaise", "barish", "fasal", "kisan", "bhav", "mandi", "bataye", "chahiye", "hoga", "mausam"],
        "ta": ["eppadi", "enna", "mazhai", "vivasaayi", "vilai", "solunga", "vendam", "erukku", "thanni"],
        "kn": ["hege", "enu", "male", "bele", "raitha", "dhara", "heliri", "beku", "ide", "neeru"],
        "ml": ["engane", "enthu", "mazha", "krishi", "vila", "parayoo", "venam", "undu", "vellam"],
        "mr": ["kasa", "kay", "paus", "pik", "shetkari", "sang", "pahije", "ahe", "pani"],
        "bn": ["kemon", "ki", "bristi", "fasal", "krishak", "dam", "bolun", "chai", "ache", "jol"]
    }

    @classmethod
    def get_supported_languages(cls) -> List[Dict[str, str]]:
        return list(cls.SUPPORTED_LANGUAGES.values())

    @classmethod
    def get_language_info(cls, code: Optional[str]) -> Dict[str, str]:
        normalized = cls.normalize_language_code(code)
        return cls.SUPPORTED_LANGUAGES.get(normalized, cls.SUPPORTED_LANGUAGES["en"])

    @classmethod
    def normalize_language_code(cls, code: Optional[str], default: str = "te") -> str:
        if not code:
            return default
        clean = code.lower().strip().split("-")[0].split("_")[0]
        if clean in cls.SUPPORTED_LANGUAGES:
            return clean
        return default

    @classmethod
    def detect_language_from_text(cls, text: str, fallback: str = "te") -> str:
        """
        High accuracy Unicode script & ngram based language identification.
        Detects Telugu, Tamil, Kannada, Malayalam, Bengali, Devanagari (Hindi/Marathi), and English.
        """
        if not text or not text.strip():
            return fallback

        counts = {
            "te": len(re.findall(r"[\u0C00-\u0C7F]", text)), # Telugu
            "ta": len(re.findall(r"[\u0B80-\u0BFF]", text)), # Tamil
            "kn": len(re.findall(r"[\u0C80-\u0CFF]", text)), # Kannada
            "ml": len(re.findall(r"[\u0D00-\u0D7F]", text)), # Malayalam
            "bn": len(re.findall(r"[\u0980-\u09FF]", text)), # Bengali
            "devanagari": len(re.findall(r"[\u0900-\u097F]", text)), # Hindi / Marathi
            "en": len(re.findall(r"[a-zA-Z]", text)) # English / Romanized
        }

        # Find script with highest character count
        max_script = max(counts, key=counts.get)
        max_count = counts[max_script]

        if max_count > 0:
            if max_script == "te":
                return "te"
            if max_script == "ta":
                return "ta"
            if max_script == "kn":
                return "kn"
            if max_script == "ml":
                return "ml"
            if max_script == "bn":
                return "bn"
            if max_script == "devanagari":
                # Check Marathi vs Hindi markers
                text_words = set(re.findall(r"[\u0900-\u097F]+", text))
                mr_matches = sum(1 for w in cls.MARATHI_KEYWORDS if w in text_words)
                hi_matches = sum(1 for w in cls.HINDI_KEYWORDS if w in text_words)
                if mr_matches > hi_matches:
                    return "mr"
                return "hi"
            if max_script == "en":
                # Check for Romanized Indian language
                text_lower = text.lower()
                for lang_code, keywords in cls.ROMAN_KEYWORDS.items():
                    if any(re.search(rf"\b{kw}\b", text_lower) for kw in keywords):
                        return lang_code
                return "en"

        return fallback

