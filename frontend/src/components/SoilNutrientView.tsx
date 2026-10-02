import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FlaskConical, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export const SoilNutrientView: React.FC = () => {
  const { t, setCurrentScreen, farmer } = useApp();

  const [ph, setPh] = useState<number>(6.8);
  const [nitrogen, setNitrogen] = useState<string>('Medium');
  const [phosphorus, setPhosphorus] = useState<string>('Medium');
  const [potassium, setPotassium] = useState<string>('High');
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.55);
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/soil/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ph,
          nitrogen,
          phosphorus,
          potassium,
          organic_carbon: organicCarbon,
          soil_type: farmer.soil_type || 'Black Cotton Soil',
          crop: farmer.current_crop || 'Chilli'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.warn('Soil evaluation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in duration-200">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {t.soilScreenTitle}
        </span>
      </div>

      {/* Intro Description */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-[#192E20]">
            {t.soilScreenTitle}
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          {t.soilScreenSubtitle}
        </p>

        {/* Form Inputs */}
        <div className="space-y-4 mt-4 pt-3 border-t border-gray-100">
          
          {/* pH Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">
                {t.soilPhLabel}: <span className="text-sm font-extrabold text-[#133E2F]">{ph}</span>
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                ph < 6.0 ? 'bg-amber-100 text-amber-800' : (ph > 7.8 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800')
              }`}>
                {ph < 6.0 ? 'Acidic' : (ph > 7.8 ? 'Alkaline' : 'Optimal')}
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="9.0"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-[#2E7D32] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
              <span>5.0 (Acidic)</span>
              <span>7.0 (Neutral)</span>
              <span>9.0 (Alkaline)</span>
            </div>
          </div>

          {/* Organic Carbon */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">
                {t.organicCarbonLabel}: <span className="text-sm font-extrabold text-[#133E2F]">{organicCarbon}%</span>
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                organicCarbon < 0.5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {organicCarbon < 0.5 ? 'Low (<0.5%)' : 'Good'}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.2"
              step="0.05"
              value={organicCarbon}
              onChange={(e) => setOrganicCarbon(parseFloat(e.target.value))}
              className="w-full accent-[#2E7D32] cursor-pointer"
            />
          </div>

          {/* N-P-K Selectors */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Nitrogen */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Nitrogen (N)
              </label>
              <select
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full min-h-[42px] px-2 rounded-xl border border-gray-200 text-xs font-bold bg-white"
              >
                <option value="Low">Low (తక్కువ)</option>
                <option value="Medium">Medium (మధ్యస్థం)</option>
                <option value="High">High (ఎక్కువ)</option>
              </select>
            </div>

            {/* Phosphorus */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Phosphorus (P)
              </label>
              <select
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full min-h-[42px] px-2 rounded-xl border border-gray-200 text-xs font-bold bg-white"
              >
                <option value="Low">Low (తక్కువ)</option>
                <option value="Medium">Medium (మధ్యస్థం)</option>
                <option value="High">High (ఎక్కువ)</option>
              </select>
            </div>

            {/* Potassium */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Potassium (K)
              </label>
              <select
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full min-h-[42px] px-2 rounded-xl border border-gray-200 text-xs font-bold bg-white"
              >
                <option value="Low">Low (తక్కువ)</option>
                <option value="Medium">Medium (మధ్యస్థం)</option>
                <option value="High">High (ఎక్కువ)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isLoading}
            className="w-full min-h-[50px] bg-[#2E7D32] hover:bg-[#256628] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition active:scale-98 text-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isLoading ? 'విశ్లేషిస్తోంది...' : t.evaluateSoilBtn}</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {result && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* pH Meaning */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
              {t.phMeaningTitle}
            </span>
            <div className="text-sm font-bold text-[#133E2F]">
              {result.evaluations?.ph?.status} (pH {ph})
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mt-1">
              {result.evaluations?.ph?.plain_meaning}
            </p>
          </div>

          {/* Organic Carbon Status */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              {t.organicManureAdvice}
            </span>
            <div className="text-sm font-bold text-amber-950">
              {result.evaluations?.organic_carbon?.status}
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mt-1">
              {result.evaluations?.organic_carbon?.plain_meaning}
            </p>
          </div>

          {/* Recommendations List */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 mb-2">
              {t.nutrientGuidanceTitle} ({farmer.current_crop})
            </h4>
            <div className="space-y-2">
              {result.actionable_recommendations?.map((rec: string, i: number) => (
                <div key={i} className="text-xs text-gray-800 flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Soil Health Card Notice */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-600 text-[11px] flex items-start gap-2.5 leading-relaxed">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.soilHealthCardNotice}</span>
          </div>

        </div>
      )}

    </div>
  );
};
