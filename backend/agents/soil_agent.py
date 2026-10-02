from typing import Dict, Any, Optional
from datetime import datetime

class SoilAgent:
    name = "Soil and Nutrient Agent"
    description = "Interprets soil test parameters (pH, N-P-K, Organic Carbon) into plain farmer language and recommends balanced nutrient stewardship."

    @classmethod
    def evaluate_soil(
        cls,
        ph: Optional[float] = None,
        nitrogen: Optional[str] = None, # Low / Medium / High
        phosphorus: Optional[str] = None,
        potassium: Optional[str] = None,
        organic_carbon: Optional[float] = None, # percentage e.g. 0.45%
        soil_type: Optional[str] = "Black Cotton Soil",
        crop: Optional[str] = "Chilli"
    ) -> Dict[str, Any]:
        """
        Analyzes soil test values and provides actionable, safe interpretations.
        """
        evaluations = {}
        missing_fields = []
        recommendations = []
        
        # pH interpretation
        if ph is not None:
            if ph < 6.0:
                ph_status = "Acidic (ఆమ్ల నేల / अम्लीय मिट्टी / ಆಮ್ಲೀಯ ಮಣ್ಣು)"
                ph_meaning = "Soil is acidic. Plant roots struggle to absorb phosphorus and calcium. Micronutrient toxicity like aluminum or manganese may occur."
                recommendations.append("Apply agricultural lime (సున్నం / चूना / ಸುಣ್ಣ) @ 250-400 kg/acre based on official lab buffer test prior to ploughing.")
            elif 6.0 <= ph <= 7.8:
                ph_status = "Optimal / Neutral (అనుకూలమైన సాధారణ నేల / उपयुक्त उदासीन / ಸೂಕ್ತ ಸಾಮಾನ್ಯ ಮಣ್ಣು)"
                ph_meaning = "Ideal soil pH range. Major nutrients (N, P, K) and beneficial soil microbes are highly active."
                recommendations.append("Maintain good soil organic matter; no chemical soil amendment needed.")
            else:
                ph_status = "Alkaline / Saline (క్షార నేల / क्षारीय मिट्टी / ಕ್ಷಾರೀಯ ಮಣ್ಣು)"
                ph_meaning = "Soil is alkaline. Zinc, iron, and boron become bound up and unavailable to plant roots."
                recommendations.append("Apply agricultural gypsum (జిప్సం / जिप्सम) @ 300-500 kg/acre and incorporate green manure (Daincha/Sunn hemp) to lower alkalinity.")
            evaluations["ph"] = {
                "measured_value": ph,
                "status": ph_status,
                "plain_meaning": ph_meaning
            }
        else:
            missing_fields.append("Soil pH")

        # Organic Carbon
        if organic_carbon is not None:
            if organic_carbon < 0.5:
                oc_status = "Low (< 0.5% - బలహీనమైన సేంద్రీయ కర్బనం / कम जैविक कार्बन)"
                oc_meaning = "Soil microbial activity and moisture-holding capacity are critically low. Fertilizer efficiency is poor."
                recommendations.append("Incorporate 4-5 tonnes of well-rotted Farm Yard Manure (FYM / పశువుల ఎరువు) or 2 tonnes of vermicompost per acre before sowing.")
            elif 0.5 <= organic_carbon <= 0.75:
                oc_status = "Medium (0.5% - 0.75% - మధ్యస్థం / मध्यम)"
                oc_meaning = "Moderate organic carbon. Suitable for crop cultivation, but benefits from periodic organic replenishment."
                recommendations.append("Retain crop residues in the field rather than burning them.")
            else:
                oc_status = "High (> 0.75% - ఉత్తమ సేంద్రీయ కర్బనం / उच्च जैविक कार्बन)"
                oc_meaning = "Excellent biological soil health with rich humus and earthworm activity."
            evaluations["organic_carbon"] = {
                "measured_value": f"{organic_carbon}%",
                "status": oc_status,
                "plain_meaning": oc_meaning
            }
        else:
            missing_fields.append("Organic Carbon")

        # NPK status
        n_stat = nitrogen or "Medium"
        p_stat = phosphorus or "Medium"
        k_stat = potassium or "High"

        evaluations["npk"] = {
            "nitrogen": {
                "level": n_stat,
                "advice": "Apply nitrogen in 3 split doses (basal, vegetative, flowering). Use neem-coated urea to prevent volatilization." if n_stat == "Low" else "Standard recommended nitrogen split. Avoid over-dosing."
            },
            "phosphorus": {
                "level": p_stat,
                "advice": "Apply single super phosphate (SSP) or DAP entirely as basal dose during final ploughing." if p_stat == "Low" else "Moderate phosphorus is adequate for early root establishment."
            },
            "potassium": {
                "level": k_stat,
                "advice": "Apply Muriate of Potash (MOP) during fruit/grain filling stage to ensure seed boldness, disease resistance, and drought tolerance."
            }
        }

        # Micronutrient note
        if crop in ["Chilli", "Tomato", "Cotton"]:
            recommendations.append(f"For {crop}: Spray zinc sulfate (0.2%) and borax (0.1%) during vegetative and flowering transitions if leaf veins show chlorosis.")

        return {
            "has_measured_data": len(missing_fields) < 2,
            "soil_type": soil_type,
            "target_crop": crop,
            "evaluations": evaluations,
            "missing_fields": missing_fields,
            "actionable_recommendations": recommendations,
            "safety_note": "Nutrient doses must align with your official Soil Health Card (SHC) issued by the Department of Agriculture. Never exceed recommended urea dosages.",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M IST")
        }
