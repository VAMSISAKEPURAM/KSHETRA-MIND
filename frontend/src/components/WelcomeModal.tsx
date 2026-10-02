import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Sprout, CheckCircle2, ArrowRight } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { language, setLanguage, t, setShowWelcome, setShowOnboarding } = useApp();

  const languageCards: { code: Language; name: string; script: string; greeting: string }[] = [
    { code: 'te', name: 'Telugu', script: 'తెలుగు', greeting: 'నమస్కారం' },
    { code: 'en', name: 'English', script: 'English', greeting: 'Welcome' },
    { code: 'hi', name: 'Hindi', script: 'हिन्दी', greeting: 'नमस्ते' },
    { code: 'kn', name: 'Kannada', script: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ' },
  ];

  const handleContinue = () => {
    localStorage.setItem('km_welcome_shown', 'true');
    setShowWelcome(false);
    // If farmer is first time, launch quick onboarding
    const isSaved = localStorage.getItem('km_farmer');
    if (!isSaved) {
      setShowOnboarding(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        
        {/* Hero Banner with Generated Authentic Photo */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#133E2F]">
          <img 
            src="/kshetramind_hero.jpg" 
            alt="KshetraMind Indian Agriculture" 
            className="w-full h-full object-cover object-top opacity-90 hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              // Graceful fallback if image path resolution differs
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
            <div className="inline-flex items-center gap-2 bg-emerald-700/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 w-fit mb-1 border border-emerald-400/30">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.appName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5">
              {t.welcomeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Language Selection Card Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-[#192E20]">
              {t.selectLanguage}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.welcomeSubtitle}
            </p>
          </div>

          {/* 4 Large Language Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {languageCards.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`min-h-[76px] p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all duration-150 active:scale-98 ${
                    isSelected 
                      ? 'border-[#2E7D32] bg-emerald-50/80 shadow-md ring-2 ring-emerald-200' 
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      {item.greeting}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32] fill-emerald-100" />
                    )}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#133E2F]">
                      {item.script}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {item.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button (Large 52px touch target) */}
          <button
            onClick={handleContinue}
            className="w-full min-h-[52px] mt-3 bg-[#2E7D32] hover:bg-[#256628] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all duration-150 active:scale-98"
          >
            <span>{t.continueBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
