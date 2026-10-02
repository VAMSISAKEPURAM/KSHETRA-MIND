import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sprout, 
  Camera, 
  FlaskConical, 
  CheckCircle2, 
  Circle, 
  Store, 
  Mic, 
  Send, 
  ArrowRight, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    farmer, 
    t, 
    weather, 
    tasks, 
    toggleTaskStatus, 
    alerts, 
    mandiItems, 
    setCurrentScreen,
    language 
  } = useApp();

  const [quickQuery, setQuickQuery] = useState('');

  // Get appropriate greeting based on time of day
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? t.greetingMorning : (hour < 17 ? t.greetingAfternoon : t.greetingEvening);

  // Active unread alerts
  const activeAlert = alerts.find(a => !a.is_read);

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    sessionStorage.setItem('km_pending_query', quickQuery.trim());
    setCurrentScreen('ask');
  };

  return (
    <div className="space-y-4 pb-20 pt-2 animate-in fade-in duration-200">
      
      {/* 1. Personalized Farmer Greeting Banner */}
      <div className="bg-gradient-to-r from-[#133E2F] via-[#1B4D3E] to-[#25634F] text-white p-5 rounded-3xl shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/40 px-2.5 py-0.5 rounded-full mb-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{farmer.village ? `${farmer.village}, ` : ''}{farmer.district}, {farmer.state}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {greetingTime}, {farmer.name || 'రైతు బంధు'}!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
              {t.tagline}
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('ask')}
            className="min-h-[46px] px-4 py-2 bg-[#2E7D32] hover:bg-[#388e3c] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95 border border-emerald-400/40"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{t.askBannerTitle}</span>
          </button>
        </div>
      </div>

      {/* 2. Justified Alert Notice (if active) */}
      {activeAlert && (
        <div 
          onClick={() => setCurrentScreen('alerts')}
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer shadow-sm transition hover:shadow-md ${
            activeAlert.severity === 'warning' 
              ? 'bg-amber-50/90 border-amber-200 text-amber-950' 
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${
              activeAlert.severity === 'warning' ? 'bg-amber-200/80 text-amber-800' : 'bg-emerald-200/80 text-emerald-800'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">{activeAlert.title}</div>
              <p className="text-xs text-gray-600 line-clamp-1">{activeAlert.description}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      )}

      {/* 3. Today's Weather & Crop Status (2-col grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Weather Card */}
        <div 
          onClick={() => setCurrentScreen('weather')}
          className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                {t.weatherCardTitle}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#192E20]">
                  {weather ? Math.round(weather.current.temperature) : 29}°C
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {weather?.current.condition.split('(')[0] || 'Partly Cloudy'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <CloudSun className="w-7 h-7" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-[11px] text-gray-400 font-medium">{t.rainProbLabel}</div>
                <div className="text-xs font-bold text-gray-800">
                  {weather ? weather.current.rain_probability : 25}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-500" />
              <div>
                <div className="text-[11px] text-gray-400 font-medium">{t.humidityLabel}</div>
                <div className="text-xs font-bold text-gray-800">
                  {weather ? weather.current.humidity : 68}%
                </div>
              </div>
            </div>
          </div>

          {/* Spray advisory badge */}
          <div className="mt-3 bg-emerald-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900 font-semibold">
            <span>{weather?.farm_advisory.key_message || t.spraySafeMsg}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
          </div>
        </div>

        {/* Current Crop Card */}
        <div 
          onClick={() => setCurrentScreen('farm')}
          className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                {t.currentCropTitle}
              </span>
              <h3 className="text-2xl font-extrabold text-[#192E20] mt-1">
                {farmer.current_crop || 'Chilli (మిరప)'}
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {farmer.farm_size} {farmer.farm_size_unit} • {farmer.water_source}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#2E7D32]">
              <Sprout className="w-7 h-7" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-gray-400 font-medium">{t.stageLabel}</div>
              <div className="text-xs font-bold text-emerald-700">
                {farmer.crop_stage || 'Flowering & Fruiting (పూత & కాయ)'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-gray-400 font-medium">{t.plantedOnLabel}</div>
              <div className="text-xs font-bold text-gray-700">52 Days ago</div>
            </div>
          </div>

          <div className="mt-3 bg-emerald-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900 font-semibold">
            <span>{t.myFarmSubtitle.split('.')[0]}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
          </div>
        </div>

      </div>

      {/* 4. Action Cards: Crop Health Check & Soil Guidance */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Leaf Disease Scan Button */}
        <button
          onClick={() => setCurrentScreen('health')}
          className="min-h-[96px] p-4 bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition text-left flex flex-col justify-between group active:scale-98"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 leading-tight">
              {t.cropHealthCardTitle}
            </div>
            <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
              {t.cropHealthCardDesc}
            </div>
          </div>
        </button>

        {/* Soil & Nutrient Guidance */}
        <button
          onClick={() => setCurrentScreen('soil')}
          className="min-h-[96px] p-4 bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition text-left flex flex-col justify-between group active:scale-98"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 leading-tight">
              {t.soilCardTitle}
            </div>
            <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
              {t.soilCardDesc}
            </div>
          </div>
        </button>

      </div>

      {/* 5. Today's Farm Tasks (Checklist) */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-bold text-base text-[#192E20]">
              {t.tasksCardTitle}
            </h3>
          </div>
          <button
            onClick={() => setCurrentScreen('plan')}
            className="text-xs font-bold text-[#2E7D32] hover:underline"
          >
            {t.viewAllBtn}
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-gray-500 py-3 text-center">{t.noTasksToday}</p>
        ) : (
          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isDone 
                      ? 'bg-gray-50 border-gray-200 opacity-60' 
                      : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-300'
                  }`}
                >
                  <button className="mt-0.5 text-[#2E7D32]">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 hover:text-emerald-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className={`text-xs font-bold ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  </div>
                  {task.priority === 'high' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 shrink-0">
                      High
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Nearby Mandi Prices Ticker */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-bold text-base text-[#192E20]">
              {t.mandiCardTitle}
            </h3>
          </div>
          <button
            onClick={() => setCurrentScreen('market')}
            className="text-xs font-bold text-[#2E7D32] hover:underline"
          >
            {t.viewAllBtn}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {mandiItems.slice(0, 4).map((m) => (
            <div 
              key={m.id}
              onClick={() => setCurrentScreen('market')}
              className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-emerald-200 transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-gray-900">
                  {m.commodity} • {m.market}
                </div>
                <div className="text-[11px] text-gray-400">
                  {m.observation_date} • {m.variety}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-[#133E2F]">
                  ₹{m.modal_price.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500">
                  / Quintal
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Quick Ask KshetraMind AI Form */}
      <div className="bg-[#133E2F] text-white rounded-3xl p-4 sm:p-5 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="font-bold text-sm text-white">{t.askBannerTitle}</h4>
        </div>
        <form onSubmit={handleQuickAsk} className="flex gap-2">
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder={t.askBannerPlaceholder}
            className="flex-1 min-h-[48px] px-4 rounded-xl bg-white/10 text-white placeholder-emerald-200/50 border border-emerald-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="button"
            onClick={() => setCurrentScreen('ask')}
            className="min-h-[48px] px-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#388e3c] text-white font-bold flex items-center justify-center transition active:scale-95"
            title={t.askMicButton}
          >
            <Mic className="w-5 h-5 text-emerald-100" />
          </button>
          <button
            type="submit"
            className="min-h-[48px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold flex items-center justify-center transition active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
