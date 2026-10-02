import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FarmerProfile } from '../types';
import { 
  User, 
  MapPin, 
  Ruler, 
  Droplet, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  X
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { farmer, setFarmer, t, showOnboarding, setShowOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FarmerProfile>({ ...farmer });

  if (!showOnboarding) return null;

  const districtsByState: Record<string, string[]> = {
    Telangana: ['Warangal', 'Nizamabad', 'Karimnagar', 'Suryapet', 'Khammam', 'Nalgonda'],
    'Andhra Pradesh': ['Guntur', 'Kurnool', 'Chittoor', 'Krishna', 'Anantapur'],
    Karnataka: ['Kolar', 'Belagavi', 'Raichur', 'Davanagere', 'Tumakuru'],
    Maharashtra: ['Nagpur', 'Amravati', 'Yavatmal', 'Nashik'],
    'Uttar Pradesh': ['Agra', 'Aligarh', 'Mathura', 'Varanasi']
  };

  const crops = ['Chilli', 'Cotton', 'Paddy', 'Tomato', 'Maize', 'Groundnut'];
  const waterSources = ['Borewell & Drip', 'Borewell Only', 'Canal Irrigation', 'Rain-fed Only'];
  const soilTypes = ['Black Cotton Soil', 'Red Sandy Loam', 'Clay Loam', 'Alluvial Soil'];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save
      setFarmer(formData);
      setShowOnboarding(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setFarmer(formData);
      setShowOnboarding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#133E2F] text-white p-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              {t.stepIndicator} {step} / {totalSteps}
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {t.onboardingTitle}
            </h2>
          </div>
          <button 
            onClick={() => setShowOnboarding(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-100"
            aria-label={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-950/20 h-1.5">
          <div 
            className="bg-[#2E7D32] h-1.5 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* STEP 1: Name & Village */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <User className="w-4 h-4 text-[#2E7D32]" />
                <span>{t.fieldFarmerName}</span>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.fieldFarmerNamePlaceholder}
                className="w-full min-h-[50px] px-4 rounded-xl border-2 border-gray-200 focus:border-[#2E7D32] focus:outline-none text-base font-semibold"
              />

              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm pt-2">
                <MapPin className="w-4 h-4 text-[#2E7D32]" />
                <span>{t.fieldVillage}</span>
              </div>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder={t.fieldVillagePlaceholder}
                className="w-full min-h-[50px] px-4 rounded-xl border-2 border-gray-200 focus:border-[#2E7D32] focus:outline-none text-base"
              />
            </div>
          )}

          {/* STEP 2: State & District */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <label className="block text-emerald-800 font-semibold text-sm mb-1.5">
                  {t.fieldState}
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const defaultDist = districtsByState[newState]?.[0] || 'Warangal';
                    setFormData({ ...formData, state: newState, district: defaultDist });
                  }}
                  className="w-full min-h-[50px] px-3.5 rounded-xl border-2 border-gray-200 focus:border-[#2E7D32] focus:outline-none text-base font-semibold bg-white"
                >
                  {Object.keys(districtsByState).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-800 font-semibold text-sm mb-1.5">
                  {t.fieldDistrict}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full min-h-[50px] px-3.5 rounded-xl border-2 border-gray-200 focus:border-[#2E7D32] focus:outline-none text-base font-semibold bg-white"
                >
                  {(districtsByState[formData.state] || []).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-800 font-semibold text-sm mb-1.5">
                  {t.fieldFarmSize}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formData.farm_size}
                    onChange={(e) => setFormData({ ...formData, farm_size: parseFloat(e.target.value) || 1 })}
                    className="w-2/3 min-h-[50px] px-4 rounded-xl border-2 border-gray-200 focus:border-[#2E7D32] focus:outline-none text-base font-bold"
                  />
                  <select
                    value={formData.farm_size_unit}
                    onChange={(e) => setFormData({ ...formData, farm_size_unit: e.target.value })}
                    className="w-1/3 min-h-[50px] px-2 rounded-xl border-2 border-gray-200 font-semibold bg-white text-sm"
                  >
                    <option value="Acres">Acres (ఎకరాలు)</option>
                    <option value="Guntas">Guntas (గుంటలు)</option>
                    <option value="Hectares">Hectares</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Current Crop */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
              <label className="block text-emerald-800 font-semibold text-sm">
                {t.fieldCurrentCrop}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {crops.map((c) => {
                  const isSel = formData.current_crop === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, current_crop: c })}
                      className={`min-h-[52px] p-3 rounded-xl border-2 text-left font-bold flex items-center justify-between transition ${
                        isSel 
                          ? 'border-[#2E7D32] bg-emerald-50 text-emerald-900' 
                          : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      <span>{c}</span>
                      {isSel && <Check className="w-4 h-4 text-[#2E7D32]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Water Source & Soil */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <label className="block text-emerald-800 font-semibold text-sm mb-1.5">
                  <Droplet className="w-3.5 h-3.5 inline mr-1 text-[#2E7D32]" />
                  {t.fieldWaterSource}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {waterSources.map((ws) => {
                    const isSel = formData.water_source === ws;
                    return (
                      <button
                        key={ws}
                        type="button"
                        onClick={() => setFormData({ ...formData, water_source: ws })}
                        className={`min-h-[48px] p-2.5 rounded-xl border-2 text-xs font-bold text-left transition ${
                          isSel ? 'border-[#2E7D32] bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {ws}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-emerald-800 font-semibold text-sm mb-1.5">
                  <Layers className="w-3.5 h-3.5 inline mr-1 text-[#2E7D32]" />
                  {t.fieldSoilType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {soilTypes.map((st) => {
                    const isSel = formData.soil_type === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, soil_type: st })}
                        className={`min-h-[48px] p-2.5 rounded-xl border-2 text-xs font-bold text-left transition ${
                          isSel ? 'border-[#2E7D32] bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="min-h-[48px] px-4 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="min-h-[48px] px-4 rounded-xl text-gray-500 font-medium hover:text-gray-800 text-sm"
            >
              {t.skipStep}
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 min-h-[50px] bg-[#2E7D32] hover:bg-[#256628] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md text-base"
          >
            <span>{step === totalSteps ? t.finishOnboarding : t.continueBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
