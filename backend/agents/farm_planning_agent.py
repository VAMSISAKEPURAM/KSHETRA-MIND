from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

STAGE_TEMPLATES = {
    "Chilli": [
        {
            "stage": "Before Planting",
            "title": "Deep Summer Ploughing & FYM Application",
            "description": "Plough field deeply (20-25 cm) to expose resting pupae of thrips and soil-borne pathogens. Incorporate 5 tonnes well-decomposed FYM or compost per acre.",
            "days_offset": -15,
            "priority": "high"
        },
        {
            "stage": "Before Planting",
            "title": "Raised Bed & Drip Lateral Laying",
            "description": "Form raised beds (height 15 cm, width 90 cm) with spacing of 45 cm between rows. Install drip lines and test discharge.",
            "days_offset": -3,
            "priority": "medium"
        },
        {
            "stage": "Early Growth",
            "title": "Seedling Transplanting & Root Dip",
            "description": "Transplant healthy 30-35 day old seedlings in late afternoon. Dip roots in Trichoderma viride (10g/L) for wilt prevention.",
            "days_offset": 0,
            "priority": "high"
        },
        {
            "stage": "Early Growth",
            "title": "Gap Filling & Light Irrigation",
            "description": "Inspect seedling survival 5-7 days after transplanting. Replace dead hills with reserved seedlings.",
            "days_offset": 7,
            "priority": "medium"
        },
        {
            "stage": "Crop Development",
            "title": "First Top Dressing & Intercultivation",
            "description": "Apply first dose of neem-coated urea and potash along rows followed by earthing up. Remove all weeds.",
            "days_offset": 25,
            "priority": "medium"
        },
        {
            "stage": "Flowering & Fruiting",
            "title": "Sticky Traps Installation & Thrips Monitoring",
            "description": "Set up 20 yellow and blue sticky traps per acre at crop canopy level. Check weekly for whiteflies and thrips.",
            "days_offset": 45,
            "priority": "high"
        },
        {
            "stage": "Flowering & Fruiting",
            "title": "Foliar Micronutrient & 19:19:19 Spray",
            "description": "Spray 19:19:19 (5g/L) + Boron (1g/L) during flower initiation to minimize flower drop.",
            "days_offset": 55,
            "priority": "medium"
        },
        {
            "stage": "Crop Protection",
            "title": "Anthracnose & Fruit Rot Scouting",
            "description": "Inspect developing pods for circular sunken spots. Avoid night overhead watering.",
            "days_offset": 75,
            "priority": "high"
        },
        {
            "stage": "Harvest Preparation",
            "title": "Withhold Irrigation before First Picking",
            "description": "Withhold irrigation 3-4 days before picking to encourage firm, uniform red color development.",
            "days_offset": 100,
            "priority": "medium"
        },
        {
            "stage": "After Harvest",
            "title": "Sun Drying on Tarpaulin",
            "description": "Spread picked red chillies cleanly on food-grade HDPE sheets. Do not dry directly on bare dusty mud floors.",
            "days_offset": 115,
            "priority": "high"
        }
    ],
    "Paddy": [
        {
            "stage": "Before Planting",
            "title": "Nursery Bed Preparation & Seed Treatment",
            "description": "Treat certified seed with Carbendazim (2g/kg) or Trichoderma (10g/kg). Prepare raised wet nursery beds.",
            "days_offset": -25,
            "priority": "high"
        },
        {
            "stage": "Before Planting",
            "title": "Puddling & Basal Fertilizer Incorporation",
            "description": "Puddle soil thoroughly to break soil capillaries. Incorporate full dose of SSP and 1/3rd Urea during final leveling.",
            "days_offset": -1,
            "priority": "high"
        },
        {
            "stage": "Early Growth",
            "title": "Transplanting at 2-3 Seedlings per Hill",
            "description": "Transplant 20-25 day old seedlings at 20x15 cm spacing. Leave 30 cm alleyway every 2 meters for aeration.",
            "days_offset": 0,
            "priority": "high"
        },
        {
            "stage": "Crop Development",
            "title": "Tillering Nitrogen Top Dressing",
            "description": "Apply second split of urea at active tillering stage (21 days after transplanting).",
            "days_offset": 21,
            "priority": "medium"
        },
        {
            "stage": "Crop Protection",
            "title": "Stem Borer & Blast Monitoring",
            "description": "Scout for 'dead hearts' in tillers and blast eye-spots on leaves. Drain field if BPH is sighted.",
            "days_offset": 45,
            "priority": "high"
        },
        {
            "stage": "Flowering & Fruiting",
            "title": "Panicle Initiation & Water Maintenance",
            "description": "Maintain 2-3 cm standing water from panicle emergence to milk stage. Water deficit now causes high chaffiness.",
            "days_offset": 65,
            "priority": "high"
        },
        {
            "stage": "Harvest Preparation",
            "title": "Complete Field Drainage",
            "description": "Drain standing water completely 10-12 days before harvest to facilitate mechanical harvester movement.",
            "days_offset": 110,
            "priority": "medium"
        },
        {
            "stage": "After Harvest",
            "title": "Paddy Moisture Testing & Threshing",
            "description": "Ensure grain moisture is below 14% before bagging for government procurement centre (PPC).",
            "days_offset": 125,
            "priority": "high"
        }
    ]
}

class FarmPlanningAgent:
    name = "Farm Planning Agent"
    description = "Generates stage-wise crop management tasks based on planting date and agronomic growth milestones."

    @classmethod
    def generate_schedule(
        cls,
        crop: str = "Chilli",
        planting_date_str: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        crop_clean = "Chilli" if "chilli" in crop.lower() else ("Paddy" if "paddy" in crop.lower() or "rice" in crop.lower() else "Chilli")
        templates = STAGE_TEMPLATES.get(crop_clean, STAGE_TEMPLATES["Chilli"])
        
        try:
            p_date = datetime.strptime(planting_date_str, "%Y-%m-%d") if planting_date_str else datetime.now() - timedelta(days=50)
        except Exception:
            p_date = datetime.now() - timedelta(days=50)

        tasks = []
        now = datetime.now()
        for i, t in enumerate(templates):
            due = p_date + timedelta(days=t["days_offset"])
            status = "completed" if due < (now - timedelta(days=5)) else "pending"
            tasks.append({
                "id": f"gen-task-{i+1}",
                "crop": crop_clean,
                "stage": t["stage"],
                "title": t["title"],
                "description": t["description"],
                "due_date": due.strftime("%Y-%m-%d"),
                "priority": t["priority"],
                "status": status,
                "is_estimate": True
            })
            
        return tasks
