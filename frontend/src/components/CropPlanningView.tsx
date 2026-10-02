import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Calendar, 
  Droplet, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const CropPlanningView: React.FC = () => {
  const { t, setCurrentScreen, farmer } = useApp();

  const [season, setSeason] = useState<string>('Kharif');
  const [waterSource, setWaterSource] = useState<string>(farmer.water_source || 'Borewell & Drip');
  const [soilType, setSoilType] = useState<string>(farmer.soil_type || 'Black Cotton Soil');
  const [results, setResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const seasons = [
    { code: 'Kharif', label: t.seasonKharif },
    { code: 'Rabi', label: t.seasonRabi },
    { code: 'Summer', label: t.seasonSummer },
  ];

  const soils = ['Black Cotton Soil', 'Red Sandy Loam', 'Clay Loam', 'Alluvial Soil'];
  const waters = ['Borewell & Drip', 'Borewell Only', 'Canal Irrigation', 'Rain-fed Only'];

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/crop-planning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: farmer.district || 'Warangal',
          season,
          water_source: waterSource,
          soil_type: soilType,
          farm_size_acres: farmer.farm_size || 3.0
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.warn('Crop planning query failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {t.cropPlanningTitle}
        </span>
      </div>

      {/* Hero Description */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-[#2E7D32]" />
          <h2 className="text-lg font-bold text-[#192E20]">
            {t.cropPlanningTitle}
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          {t.cropPlanningSubtitle}
        </p>

        {/* Input Parameters */}
        <div className="space-y-3.5 mt-4 pt-3 border-t border-gray-100">
          
          {/* Season */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#2E7D32]" />
              {t.selectSeason}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {seasons.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSeason(s.code)}
                  className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition border ${
                    season === s.code 
                      ? 'bg-[#133E2F] text-white border-[#133E2F]' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Water Availability */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              <Droplet className="w-3.5 h-3.5 inline mr-1 text-[#2E7D32]" />
              {t.waterAvailabilityLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {waters.map((w) => (
                <button
                  key={w}
                  onClick={() => setWaterSource(w)}
                  className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition border ${
                    waterSource === w 
                      ? 'bg-emerald-50 border-[#2E7D32] text-emerald-900 font-bold' 
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              <Layers className="w-3.5 h-3.5 inline mr-1 text-[#2E7D32]" />
              {t.soilTypeLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {soils.map((st) => (
                <button
                  key={st}
                  onClick={() => setSoilType(st)}
                  className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition border ${
                    soilType === st 
                      ? 'bg-emerald-50 border-[#2E7D32] text-emerald-900 font-bold' 
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isLoading}
            className="w-full min-h-[50px] bg-[#2E7D32] hover:bg-[#256628] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition active:scale-98 text-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isLoading ? 'విశ్లేషిస్తోంది / Analyzing...' : t.findSuitableCropsBtn}</span>
          </button>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm text-[#192E20]">
              {t.suitableCropsTitle}
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">
              {farmer.district} ({season})
            </span>
          </div>

          {results.recommended_crops?.map((cropItem: any, idx: number) => {
            const isTop = idx === 0;
            return (
              <div 
                key={cropItem.crop}
                className={`bg-white rounded-3xl p-5 border shadow-sm space-y-3 ${
                  isTop ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-extrabold text-[#192E20]">
                        {cropItem.crop}
                      </h4>
                      {isTop && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Best Fit
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      {cropItem.suitability_label} ({cropItem.suitability_score}% Suitability)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cropItem.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Water Need */}
                <div className="bg-gray-50 p-2.5 rounded-xl text-xs text-gray-700">
                  <span className="font-bold text-gray-900">{t.waterRequirementLabel}: </span>
                  <span>{cropItem.water_need}</span>
                </div>

                {/* Favorable Factors */}
                <div className="space-y-1">
                  {cropItem.favorable_factors?.map((f: string, i: number) => (
                    <div key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Key Risks & Cautions */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.keyRisksLabel}</span>
                  </div>
                  {cropItem.risk_factors?.slice(0, 2).map((r: string, i: number) => (
                    <div key={i} className="text-[11px] text-amber-900 leading-snug">
                      • {r}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Transparent Agronomic Disclaimer */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 text-[11px] leading-relaxed">
            {results.disclaimer || t.riskDisclaimer}
          </div>
        </div>
      )}

    </div>
  );
};
