from typing import Dict, Any, List, Optional

# Validated ICAR / Agronomic Crop Profiles
CROP_AGRONOMIC_PROFILES = {
    "Chilli": {
        "suitable_seasons": ["Kharif", "Rabi"],
        "suitable_soils": ["Black Cotton Soil", "Red Sandy Loam", "Clay Loam"],
        "water_requirement": "Moderate to High (Drip or furrow recommended, cannot tolerate waterlogging)",
        "duration_days": "150 - 180 days",
        "primary_reasons": "High commercial value, well-established APMC market infrastructure (Warangal/Guntur), excellent fit for warm tropical conditions.",
        "key_risks": [
            "Highly susceptible to viral leaf curl spread by thrips and whiteflies in dry hot spells.",
            "Water stagnation causes root rot and wilting within 24 hours.",
            "High capital investment in intercultural labor and picking."
        ]
    },
    "Cotton": {
        "suitable_seasons": ["Kharif"],
        "suitable_soils": ["Deep Black Cotton Soil", "Heavy Loam"],
        "water_requirement": "Moderate (650 - 900 mm), deep root system tolerates brief dry spells in black soils",
        "duration_days": "150 - 170 days",
        "primary_reasons": "Major cash crop with assured MSP procurement and local ginning mills.",
        "key_risks": [
            "Pink bollworm infestation risk during boll opening stage.",
            "Excessive moisture during boll maturation leads to boll rotting and fiber discoloration.",
            "Susceptible to waterlogging in flat fields without drainage channels."
        ]
    },
    "Paddy": {
        "suitable_seasons": ["Kharif", "Rabi"],
        "suitable_soils": ["Clayey Soils", "Alluvial", "Heavy Loam with low percolation"],
        "water_requirement": "High (1100 - 1400 mm), requires assured canal or high-yield borewell supply",
        "duration_days": "120 - 145 days depending on variety (e.g. Samba Mahsuri vs MTU-1010)",
        "primary_reasons": "Food staple with government MSP procurement centres (PPC) and reliable village-level threshing.",
        "key_risks": [
            "Severe yield collapse if borewell discharge drops during panicle initiation or flowering.",
            "Blast disease under high nitrogen and cool humid nights.",
            "Hopper burn from BPH under dense planting."
        ]
    },
    "Maize": {
        "suitable_seasons": ["Kharif", "Rabi", "Summer"],
        "suitable_soils": ["Well-drained Loam", "Sandy Clay Loam", "Red Soil"],
        "water_requirement": "Moderate (500 - 650 mm), drought sensitive only at tasseling and silking",
        "duration_days": "95 - 110 days",
        "primary_reasons": "Short duration, lower labor overhead, steady poultry and starch industrial demand.",
        "key_risks": [
            "Fall Armyworm (Spodoptera frugiperda) infestation requires prompt whorl monitoring.",
            "Poor cob filling if drought strikes precisely during silking."
        ]
    },
    "Groundnut": {
        "suitable_seasons": ["Kharif", "Rabi"],
        "suitable_soils": ["Red Sandy Loam", "Light Light Loam with good aeration"],
        "water_requirement": "Low to Moderate (400 - 550 mm), pegging stage requires moist soil",
        "duration_days": "105 - 120 days",
        "primary_reasons": "Enriches soil with biological nitrogen fixation; excellent rotation crop before cereals.",
        "key_risks": [
            "Heavy clay soil makes pod digging difficult and causes pod breakage.",
            "Tikka leaf spot during prolonged dampness.",
            "Aflatoxin contamination if dried pods are stored damp."
        ]
    },
    "Tomato": {
        "suitable_seasons": ["Kharif", "Rabi", "Summer"],
        "suitable_soils": ["Sandy Loam", "Clay Loam with high organic matter"],
        "water_requirement": "Regular, uniform moisture (Drip irrigation with fertigation highly effective)",
        "duration_days": "90 - 130 days",
        "primary_reasons": "Fast turnover, continuous harvests over several weeks, high profit potential in peri-urban markets.",
        "key_risks": [
            "Extreme market price volatility (can swing from ₹5/kg to ₹40/kg in two weeks).",
            "Highly perishable; lack of cold chain requires immediate sale after picking.",
            "Early blight and bacterial wilt vulnerability in high humidity."
        ]
    }
}

class CropPlanningAgent:
    name = "Crop Planning Agent"
    description = "Evaluates crop suitability against season, water availability, soil type, and realistic agronomic risks without speculative yield promises."

    @classmethod
    def plan_crops(
        cls,
        district: str = "Warangal",
        season: str = "Kharif",
        water_source: str = "Borewell & Drip",
        soil_type: str = "Black Cotton Soil",
        farm_size_acres: float = 3.0,
        preferred_crops: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        suitability_results = []
        missing_considerations = []

        if not water_source or water_source == "Not Sure":
            missing_considerations.append("Reliable water discharge details (borewell yield in summer/winter)")
        if not soil_type:
            missing_considerations.append("Precise soil drainage and texture characteristics")

        for crop_name, profile in CROP_AGRONOMIC_PROFILES.items():
            score = 70
            reasons = []
            cautions = []

            # Check season match
            if season in profile["suitable_seasons"]:
                score += 15
                reasons.append(f"Highly compatible with {season} climatic conditions in {district}.")
            else:
                score -= 25
                cautions.append(f"Off-season for {crop_name} in open fields.")

            # Check soil match
            soil_match = False
            for s in profile["suitable_soils"]:
                if any(k.lower() in soil_type.lower() for k in s.lower().split()):
                    soil_match = True
                    break
            if soil_match:
                score += 10
                reasons.append(f"Well-adapted to {soil_type}.")
            else:
                cautions.append(f"{crop_name} prefers {', '.join(profile['suitable_soils'])}; manage drainage carefully.")

            # Water availability matching
            if "rain" in water_source.lower() and crop_name in ["Paddy", "Tomato"]:
                score -= 30
                cautions.append(f"Rainfed cultivation of {crop_name} carries high drought risk during dry spells.")
            elif "drip" in water_source.lower() and crop_name in ["Chilli", "Tomato", "Cotton"]:
                score += 10
                reasons.append("Drip irrigation enables precise moisture and fertigation control.")

            suitability_results.append({
                "crop": crop_name,
                "suitability_score": min(98, max(30, score)),
                "suitability_label": "Recommended" if score >= 80 else ("Moderate Fit" if score >= 60 else "High Risk"),
                "duration": profile["duration_days"],
                "water_need": profile["water_requirement"],
                "favorable_factors": reasons,
                "risk_factors": profile["key_risks"] + cautions,
                "market_context": f"Active trading observed in regional APMC mandis."
            })

        suitability_results.sort(key=lambda x: x["suitability_score"], reverse=True)

        return {
            "query_parameters": {
                "district": district,
                "season": season,
                "water_source": water_source,
                "soil_type": soil_type,
                "farm_size": farm_size_acres
            },
            "recommended_crops": suitability_results[:4],
            "missing_information": missing_considerations,
            "disclaimer": "Crop recommendations evaluate historical agronomic compatibility. Agricultural yields depend upon weather variability, seed purity, timely weeding, and local pest pressure. No financial returns are guaranteed."
        }
