import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Info,
  ArrowLeft
} from 'lucide-react';

export const WeatherView: React.FC = () => {
  const { 
    weather, 
    refreshWeather, 
    t, 
    setCurrentScreen, 
    farmer, 
    speakText, 
    stopSpeaking, 
    isSpeaking 
  } = useApp();

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (weather) {
      const textToRead = `${t.weatherCardTitle}. ${farmer.district}. ${t.tempLabel}: ${Math.round(weather.current.temperature)}°C. ${t.rainProbLabel}: ${weather.current.rain_probability}%. ${weather.farm_advisory.key_message}`;
      speakText(textToRead);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in duration-200">
      
      {/* Top Bar with Back & Refresh */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`min-h-[44px] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isSpeaking 
                ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? t.stopAudioBtn : t.readAloudBtn}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={refreshWeather}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
            title={t.refreshBtn}
          >
            <RefreshCw className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">{t.refreshBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-[#133E2F] via-[#1B4D3E] to-[#25634F] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Source Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-200 border border-emerald-400/30">
            {weather?.is_live ? t.liveWeatherBadge : t.demoWeatherBadge}
          </span>
          <span className="text-[11px] text-emerald-200/80">
            {weather?.timestamp || 'Updated just now'}
          </span>
        </div>

        {/* Location & Temp */}
        <div className="flex items-center justify-between my-2">
          <div>
            <h2 className="text-2xl font-black text-white">
              {farmer.district || 'Warangal'}, {farmer.state || 'Telangana'}
            </h2>
            <p className="text-xs text-emerald-200 font-medium mt-0.5">
              {weather?.current.condition || 'Partly Cloudy (పాక్షికంగా మేఘావృతం)'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-black tracking-tight">
              {weather ? Math.round(weather.current.temperature) : 29}°C
            </span>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-emerald-700/50 text-center">
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-300" />
            <div className="text-[10px] text-emerald-200">{t.rainProbLabel}</div>
            <div className="text-sm font-bold mt-0.5">
              {weather ? weather.current.rain_probability : 25}%
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
            <Wind className="w-5 h-5 mx-auto mb-1 text-teal-300" />
            <div className="text-[10px] text-emerald-200">{t.humidityLabel}</div>
            <div className="text-sm font-bold mt-0.5">
              {weather ? weather.current.humidity : 68}%
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
            <CloudSun className="w-5 h-5 mx-auto mb-1 text-amber-300" />
            <div className="text-[10px] text-emerald-200">గాలి వేగం / Wind</div>
            <div className="text-sm font-bold mt-0.5">
              {weather ? weather.current.wind_speed_kmh : 11} km/h
            </div>
          </div>
        </div>
      </div>

      {/* Agricultural Advisory Card (Crucial for farmers!) */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Info className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.sprayAdvisoryTitle}</span>
        </div>

        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          weather?.farm_advisory.spray_safe 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          {weather?.farm_advisory.spray_safe ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold text-sm">
              {weather?.farm_advisory.key_message || t.spraySafeMsg}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Check field moisture before planning irrigation. Do not spray chemicals when heavy rain or strong wind is expected.
            </p>
          </div>
        </div>

        {weather?.farm_advisory.all_considerations && weather.farm_advisory.all_considerations.length > 1 && (
          <div className="space-y-1.5 pt-1">
            {weather.farm_advisory.all_considerations.map((c, i) => (
              <div key={i} className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-[#2E7D32] font-bold">•</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#2E7D32]" />
          <h3 className="font-bold text-sm text-[#192E20]">
            {t.forecast7Days}
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {(weather?.forecast || []).map((f, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div className="w-24 font-bold text-gray-800">
                {f.date.includes('-') ? new Date(f.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : f.date}
              </div>
              <div className="flex-1 text-center text-gray-500 font-medium px-2">
                {f.condition.split('(')[0]}
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="font-semibold text-blue-600 text-[11px] bg-blue-50 px-2 py-0.5 rounded-full">
                  💧 {f.precipitation_probability}%
                </span>
                <span className="font-bold text-gray-900 w-16">
                  {Math.round(f.max_temp)}° / {Math.round(f.min_temp)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Data Source Footnote */}
      <div className="text-[11px] text-gray-500 text-center px-4">
        {t.dataSourceLabel}: {weather?.source || 'Open-Meteo / IMD Meteorological Grid'}
      </div>

    </div>
  );
};
