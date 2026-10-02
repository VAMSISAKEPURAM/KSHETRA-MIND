export type Language = 'te' | 'en' | 'hi' | 'kn';

export type TextSize = 'sm' | 'base' | 'lg' | 'xl';

export type Screen = 
  | 'home'
  | 'farm'
  | 'ask'
  | 'plan'
  | 'more'
  | 'weather'
  | 'health'
  | 'soil'
  | 'market'
  | 'alerts';

export interface FarmerProfile {
  id: string;
  name: string;
  state: string;
  district: string;
  village: string;
  preferred_language: Language;
  farm_size: number;
  farm_size_unit: string;
  water_source: string;
  soil_type: string;
  current_crop?: string;
  crop_stage?: string;
}

export interface Plot {
  id: string;
  farmer_id: string;
  plot_name: string;
  size: number;
  current_crop: string;
  crop_variety: string;
  planting_date: string;
  growth_stage: string;
  water_source: string;
  soil_type: string;
}

export interface FarmTask {
  id: string;
  farmer_id?: string;
  plot_id?: string;
  crop?: string;
  stage: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface FarmAlert {
  id: string;
  farmer_id?: string;
  alert_type: 'weather' | 'pest' | 'market' | 'task';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  source: string;
  is_read: boolean;
  created_at?: string;
}

export interface WeatherData {
  is_live: boolean;
  source: string;
  district: string;
  state: string;
  timestamp: string;
  current: {
    temperature: number;
    humidity: number;
    wind_speed_kmh: number;
    weather_code: number;
    condition: string;
    rain_probability: number;
  };
  forecast: Array<{
    date: string;
    max_temp: number;
    min_temp: number;
    precipitation_probability: number;
    weather_code: number;
    condition: string;
  }>;
  farm_advisory: {
    spray_safe: boolean;
    irrigation_recommended: boolean;
    rain_alert: boolean;
    key_message: string;
    all_considerations: string[];
  };
}

export interface MandiItem {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  arrival_tonnes: number;
  observation_date: string;
  source: string;
  trend: 'up' | 'down' | 'stable';
}

export interface CropHealthResult {
  crop: string;
  image_analyzed: boolean;
  diagnosed_issue: string;
  scientific_and_local_name: string;
  confidence_score: number;
  confidence_label: string;
  main_visual_symptoms: string;
  contributing_factors: string;
  suggested_next_checks: string[];
  general_prevention_guidance: string[];
  expert_consult_recommended: boolean;
  safety_warning: string;
  disclaimer: string;
}
