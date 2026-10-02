import json
import os
from typing import List, Dict, Any, Optional

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mandi_data.json")

class MarketAgent:
    name = "Market Intelligence Agent"
    description = "Provides official Agmarknet wholesale APMC mandi observations, modal prices, and commodity arrivals."

    @staticmethod
    def _load_data() -> List[Dict[str, Any]]:
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    @classmethod
    def get_market_prices(
        cls,
        commodity: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None
    ) -> Dict[str, Any]:
        records = cls._load_data()
        filtered = []
        
        for item in records:
            match = True
            if commodity and commodity.lower() not in item["commodity"].lower() and item["commodity"].lower() not in commodity.lower():
                match = False
            if state and state.lower() != "all" and item["state"].lower() != state.lower():
                match = False
            if district and district.lower() != "all" and district.lower() not in item["district"].lower():
                match = False
            if match:
                filtered.append(item)
                
        # If no strict match, return all records for the state or commodity fallback
        if not filtered and commodity:
            for item in records:
                if commodity.lower() in item["commodity"].lower():
                    filtered.append(item)
                    
        if not filtered:
            filtered = records[:6]

        # Calculate averages/ranges
        modal_prices = [x["modal_price"] for x in filtered if "modal_price" in x]
        avg_modal = int(sum(modal_prices) / len(modal_prices)) if modal_prices else 0

        return {
            "source": "Agmarknet (Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, Govt. of India)",
            "total_markets_found": len(filtered),
            "average_modal_price": avg_modal,
            "unit": "₹ / Quintal (100 kg)",
            "disclaimer": "These are wholesale market arrivals recorded at respective APMC yards. Prices fluctuate based on moisture content, grade, and daily supply. They do not constitute a guaranteed price.",
            "markets": filtered
        }
