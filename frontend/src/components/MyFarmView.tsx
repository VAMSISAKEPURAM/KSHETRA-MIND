import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plot } from '../types';
import { 
  Trees, 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Sprout, 
  Droplet, 
  Layers, 
  Calendar, 
  Clock, 
  X,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const MyFarmView: React.FC = () => {
  const { t, setCurrentScreen, farmer, plots, setPlots } = useApp();

  const [showAddPlot, setShowAddPlot] = useState<boolean>(false);
  const [newPlotName, setNewPlotName] = useState('');
  const [newPlotCrop, setNewPlotCrop] = useState('Chilli');
  const [newPlotSize, setNewPlotSize] = useState('1.5');
  const [newPlotWater, setNewPlotWater] = useState('Borewell & Drip');
  const [newPlotSoil, setNewPlotSoil] = useState('Black Cotton Soil');

  const handleAddPlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlotName.trim()) return;

    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      farmer_id: farmer.id,
      plot_name: newPlotName.trim(),
      size: parseFloat(newPlotSize) || 1.0,
      current_crop: newPlotCrop,
      crop_variety: 'Certified Hybrid',
      planting_date: new Date().toISOString().split('T')[0],
      growth_stage: 'Vegetative Growth',
      water_source: newPlotWater,
      soil_type: newPlotSoil
    };

    setPlots([...plots, newPlot]);
    setShowAddPlot(false);
    setNewPlotName('');
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
        <button
          onClick={() => setShowAddPlot(true)}
          className="min-h-[44px] px-3.5 py-1.5 bg-[#2E7D32] hover:bg-[#256628] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addPlotBtn}</span>
        </button>
      </div>

      {/* Farm Overview Card */}
      <div className="bg-gradient-to-br from-[#133E2F] via-[#1B4D3E] to-[#25634F] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 bg-emerald-950/60 px-2.5 py-0.5 rounded-full mb-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{farmer.village ? `${farmer.village}, ` : ''}{farmer.district}, {farmer.state}</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {farmer.name}'s Farm
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              {t.myFarmSubtitle}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-white">
              {farmer.farm_size}
            </span>
            <div className="text-xs text-emerald-200 font-medium">
              {farmer.farm_size_unit} Total
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-emerald-700/50 text-xs">
          <div>
            <span className="text-emerald-300 block">{t.fieldWaterSource}:</span>
            <strong className="text-white">{farmer.water_source}</strong>
          </div>
          <div>
            <span className="text-emerald-300 block">{t.fieldSoilType}:</span>
            <strong className="text-white">{farmer.soil_type}</strong>
          </div>
        </div>
      </div>

      {/* Plots / Fields Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm text-[#192E20]">
            {t.plotLabel} ({plots.length} Plots Managed)
          </h3>
        </div>

        {plots.map((plot) => (
          <div 
            key={plot.id}
            className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-extrabold text-[#192E20]">
                  {plot.plot_name}
                </h4>
                <div className="text-xs text-emerald-700 font-bold mt-0.5">
                  {plot.current_crop} • {plot.crop_variety || 'Hybrid'}
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                {plot.size} Acres
              </span>
            </div>

            {/* Growth Journey Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-500">{t.growthStageTitle}:</span>
                <span className="text-[#2E7D32]">{plot.growth_stage}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2E7D32] h-full rounded-full w-2/3" />
              </div>
            </div>

            {/* Plot Details */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 block text-[10px]">{t.plantedOnLabel}</span>
                <span className="font-semibold text-gray-800">{plot.planting_date}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">{t.fieldWaterSource}</span>
                <span className="font-semibold text-gray-800">{plot.water_source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Agricultural Memory Section */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-2.5">
        <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wide">
          Shared Agricultural Memory (వ్యవసాయ నిల్వ సమాచారం)
        </h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Soil health baseline: pH 6.8 (Neutral), OC 0.55% recorded</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Active crops tracked: Chilli (Plot 1), Cotton (Plot 2)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Market proximity: Warangal Enumamula APMC Mandi</span>
          </div>
        </div>
      </div>

      {/* Add Plot Modal */}
      {showAddPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-emerald-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">{t.addPlotBtn}</h3>
              <button onClick={() => setShowAddPlot(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddPlot} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plot Name</label>
                <input
                  type="text"
                  required
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  placeholder="e.g. South Field (దక్షిణ చేను)"
                  className="w-full min-h-[46px] px-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Crop</label>
                  <select
                    value={newPlotCrop}
                    onChange={(e) => setNewPlotCrop(e.target.value)}
                    className="w-full min-h-[46px] px-2 rounded-xl border border-gray-300 text-sm bg-white"
                  >
                    <option value="Chilli">Chilli</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Paddy">Paddy</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Maize">Maize</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPlotSize}
                    onChange={(e) => setNewPlotSize(e.target.value)}
                    className="w-full min-h-[46px] px-3 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlot(false)}
                  className="flex-1 min-h-[46px] rounded-xl border border-gray-300 font-bold text-xs text-gray-700"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[46px] rounded-xl bg-[#2E7D32] text-white font-bold text-xs"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
