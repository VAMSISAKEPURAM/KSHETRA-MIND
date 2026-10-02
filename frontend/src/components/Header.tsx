import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language, TextSize } from '../types';
import { 
  Languages, 
  Bell, 
  Wifi, 
  WifiOff, 
  Type, 
  Sprout, 
  Check,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    textSize, 
    setTextSize, 
    isOnline, 
    unreadAlertsCount, 
    setShowAlertsModal,
    setCurrentScreen 
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const languagesList: { code: Language; name: string; nativeName: string }[] = [
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  ];

  const sizeOptions: { code: TextSize; label: string; sub: string }[] = [
    { code: 'sm', label: 'A-', sub: 'చిన్నది / Small' },
    { code: 'base', label: 'A', sub: 'సాధారణం / Normal' },
    { code: 'lg', label: 'A+', sub: 'పెద్దది / Large' },
    { code: 'xl', label: 'A++', sub: 'చాలా పెద్దది / Extra Large' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#133E2F] text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-inner border border-emerald-400/30">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">
                {t.appName}
              </h1>
              {/* Online / Offline badge */}
              <span 
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isOnline ? 'bg-emerald-800/80 text-emerald-200' : 'bg-amber-800/90 text-amber-200'
                }`}
                title={isOnline ? t.onlineStatus : t.offlineStatus}
              >
                {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium m-0 leading-tight">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Text Size Control */}
          <div className="relative">
            <button
              onClick={() => { setShowSizeMenu(!showSizeMenu); setShowLangMenu(false); }}
              className="min-h-[44px] px-2.5 py-1.5 rounded-lg bg-[#1B4D3E] hover:bg-[#25634f] text-emerald-100 flex items-center gap-1 text-sm font-semibold transition border border-emerald-700/50"
              title={t.textSizeTooltip}
              aria-label={t.textSizeTooltip}
            >
              <Type className="w-4 h-4" />
              <span className="text-xs uppercase">{textSize}</span>
            </button>

            {showSizeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 border-b border-gray-100">
                  {t.textSizeSection}
                </div>
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setTextSize(opt.code); setShowSizeMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-emerald-50 text-sm ${
                      textSize === opt.code ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold mr-2">{opt.label}</span>
                      <span className="text-xs text-gray-500">{opt.sub}</span>
                    </div>
                    {textSize === opt.code && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector Button */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowSizeMenu(false); }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#388e3c] text-white flex items-center gap-1.5 text-sm font-bold transition shadow-sm border border-emerald-500/40"
              title={t.selectLanguage}
            >
              <Languages className="w-4 h-4" />
              <span>{languagesList.find(l => l.code === language)?.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                <div className="px-3 py-1 text-xs font-bold text-gray-400 border-b border-gray-100">
                  {t.selectLanguage}
                </div>
                {languagesList.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => { setLanguage(langItem.code); setShowLangMenu(false); }}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50 transition text-sm ${
                      language === langItem.code ? 'font-bold text-emerald-800 bg-emerald-50/80' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[15px]">{langItem.nativeName}</div>
                      <div className="text-xs text-gray-400">{langItem.name}</div>
                    </div>
                    {language === langItem.code && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Farm Alerts Bell */}
          <button
            onClick={() => setShowAlertsModal(true)}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-[#1B4D3E] hover:bg-[#25634f] text-emerald-100 flex items-center justify-center relative transition border border-emerald-700/50"
            title={t.alertsTooltip}
            aria-label={t.alertsTooltip}
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white font-bold text-[11px] rounded-full flex items-center justify-center border-2 border-[#133E2F] shadow-sm animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
