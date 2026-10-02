import React from 'react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';
import { Home, Trees, MessageSquareQuote, CalendarCheck, MoreHorizontal } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, t } = useApp();

  const navItems: { screen: Screen; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { screen: 'farm', label: t.navFarm, icon: <Trees className="w-5 h-5" /> },
    { screen: 'ask', label: t.navAsk, icon: <MessageSquareQuote className="w-6 h-6" /> },
    { screen: 'plan', label: t.navPlan, icon: <CalendarCheck className="w-5 h-5" /> },
    { screen: 'more', label: t.navMore, icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:max-w-xl md:mx-auto md:bottom-3 md:rounded-2xl md:border">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          const isAskAi = item.screen === 'ask';

          if (isAskAi) {
            return (
              <button
                key={item.screen}
                onClick={() => setCurrentScreen(item.screen)}
                className="flex flex-col items-center justify-center -mt-5 relative group focus:outline-none"
                aria-label={item.label}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive 
                    ? 'bg-[#2E7D32] text-white ring-4 ring-emerald-100' 
                    : 'bg-[#133E2F] text-white hover:bg-[#1B4D3E]'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[11px] font-bold mt-1 ${
                  isActive ? 'text-[#2E7D32]' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.screen}
              onClick={() => setCurrentScreen(item.screen)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[50px] transition-colors ${
                isActive 
                  ? 'text-[#2E7D32] font-bold' 
                  : 'text-gray-500 hover:text-gray-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition ${isActive ? 'bg-emerald-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
