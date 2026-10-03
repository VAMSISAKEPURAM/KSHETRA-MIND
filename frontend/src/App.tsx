import React from 'react';
import { Mic } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeModal } from './components/WelcomeModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AlertsModal } from './components/AlertsModal';
import { HomeDashboard } from './components/HomeDashboard';
import { MyFarmView } from './components/MyFarmView';
import { WeatherView } from './components/WeatherView';
import { CropHealthView } from './components/CropHealthView';
import { CropPlanningView } from './components/CropPlanningView';
import { SoilNutrientView } from './components/SoilNutrientView';
import { MarketIntelView } from './components/MarketIntelView';
import { FarmPlanningView } from './components/FarmPlanningView';
import { AskAiView } from './components/AskAiView';
import { SettingsView } from './components/SettingsView';

const MainContent: React.FC = () => {
  const { currentScreen, setCurrentScreen, showWelcome } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#192E20] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
        {currentScreen === 'home' && <HomeDashboard />}
        {currentScreen === 'farm' && <MyFarmView />}
        {currentScreen === 'ask' && <AskAiView />}
        {currentScreen === 'plan' && <FarmPlanningView />}
        {currentScreen === 'more' && <SettingsView />}
        {currentScreen === 'weather' && <WeatherView />}
        {currentScreen === 'health' && <CropHealthView />}
        {currentScreen === 'soil' && <SoilNutrientView />}
        {currentScreen === 'market' && <MarketIntelView />}
        {currentScreen === 'alerts' && <AlertsModal />}
      </main>

      {/* Floating Multilingual Voice Assistant Button (When not on ask screen) */}
      {currentScreen !== 'ask' && (
        <button
          onClick={() => setCurrentScreen('ask')}
          className="fixed bottom-20 right-4 z-40 bg-[#2E7D32] hover:bg-[#256628] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-emerald-300 transition-all active:scale-95 animate-in fade-in"
          title="Multilingual Voice Assistant"
          aria-label="Multilingual Voice Assistant"
        >
          <Mic className="w-5 h-5 animate-pulse text-white" />
          <span className="hidden sm:inline text-xs font-bold pr-1">Voice AI</span>
        </button>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      {showWelcome && <WelcomeModal />}
      <OnboardingModal />
      <AlertsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
