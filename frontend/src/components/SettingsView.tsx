import React from 'react';
import { useApp } from '../context/AppContext';
import { Language, TextSize } from '../types';
import { 
  Settings, 
  Languages, 
  User, 
  Type, 
  Volume2, 
  Wifi, 
  ShieldCheck, 
  PhoneCall, 
  Trash2, 
  Info, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    textSize, 
    setTextSize, 
    voiceReadout, 
    setVoiceReadout, 
    isOnline, 
    farmer, 
    setShowOnboarding, 
    resetAllData 
  } = useApp();

  const languagesList: { code: Language; name: string; nativeName: string }[] = [
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ];

  const sizeOptions: { code: TextSize; label: string }[] = [
    { code: 'sm', label: 'Small (A-)' },
    { code: 'base', label: 'Normal (A)' },
    { code: 'lg', label: 'Large (A+)' },
    { code: 'xl', label: 'Extra Large (A++)' },
  ];

  const handleDeleteData = () => {
    if (confirm('మీ పొలం ప్రొఫైల్ మరియు సేవ్ చేసిన డేటాను తొలగించాలనుకుంటున్నారా? / Are you sure you want to reset all farm data?')) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-4 pb-28 pt-2 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-[#2E7D32]" />
          <h2 className="text-lg font-bold text-[#192E20]">
            {t.settingsTitle}
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          KshetraMind AI • Version 1.0.0
        </p>
      </div>

      {/* 1. Language Selection Section */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
          <Languages className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.languageSection}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {languagesList.map((item) => {
            const isSel = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`min-h-[56px] p-3 rounded-2xl border-2 text-left flex items-center justify-between transition active:scale-98 ${
                  isSel 
                    ? 'border-[#2E7D32] bg-emerald-50 text-emerald-950 font-bold shadow-xs' 
                    : 'border-gray-200 bg-gray-50/50 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="text-base font-bold">{item.nativeName}</div>
                  <div className="text-[11px] text-gray-400 font-medium">{item.name}</div>
                </div>
                {isSel && <Check className="w-4 h-4 text-[#2E7D32]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Text Size Accessibility */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
          <Type className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.textSizeSection}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.code}
              onClick={() => setTextSize(opt.code)}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition border ${
                textSize === opt.code 
                  ? 'border-[#2E7D32] bg-emerald-50 text-emerald-900 shadow-xs' 
                  : 'border-gray-200 text-gray-700 bg-gray-50/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Farmer Profile Edit */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">{farmer.name}</div>
            <div className="text-xs text-gray-500">
              {farmer.village ? `${farmer.village}, ` : ''}{farmer.district}, {farmer.state} • {farmer.farm_size} {farmer.farm_size_unit}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowOnboarding(true)}
          className="min-h-[42px] px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 text-emerald-900 font-bold text-xs hover:bg-emerald-100"
        >
          {t.editBtn}
        </button>
      </div>

      {/* 4. Voice Read-Aloud Toggle */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">{t.voiceReadoutSection}</div>
            <p className="text-xs text-gray-500 mt-0.5">{t.voiceReadoutDesc}</p>
          </div>
        </div>

        <button
          onClick={() => setVoiceReadout(!voiceReadout)}
          className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none shrink-0 ml-2 ${
            voiceReadout ? 'bg-[#2E7D32]' : 'bg-gray-300'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
            voiceReadout ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>

      {/* 5. Offline Support Info */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
          <Wifi className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.offlineSupportSection}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {t.offlineSupportDesc}
        </p>
        <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
          Status: {isOnline ? 'Online Synced' : 'Offline Cached Storage Active'}
        </div>
      </div>

      {/* 6. Kisan Call Centre Helpline */}
      <div className="bg-gradient-to-r from-emerald-800 to-[#133E2F] text-white rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wide">
          <PhoneCall className="w-4 h-4 text-emerald-300" />
          <span>{t.helplineTitle}</span>
        </div>
        <h4 className="text-base font-extrabold text-white">
          {t.kisanCallCentre}
        </h4>
        <p className="text-xs text-emerald-100/80">
          Government of India Kisan Call Centre — toll-free agronomic advice available in all regional languages from 6 AM to 10 PM.
        </p>
      </div>

      {/* 7. Data Privacy & Reset */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.privacySection}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {t.privacyDesc}
        </p>

        <button
          onClick={handleDeleteData}
          className="min-h-[46px] w-full px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>{t.deleteDataBtn}</span>
        </button>
      </div>

      {/* 8. About KshetraMind */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
          <Info className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.aboutTitle}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {t.aboutText}
        </p>
        <div className="text-[10px] text-gray-400 pt-1">
          PAN-IIT Summit 2026 Innovation Prototype • Designed with Farmer-First Principles
        </div>
      </div>

    </div>
  );
};
