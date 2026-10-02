import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TextSize, Screen, FarmerProfile, Plot, FarmTask, FarmAlert, WeatherData, MandiItem } from '../types';
import { translations, TranslationDict } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  isOnline: boolean;
  
  // Modals
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showAlertsModal: boolean;
  setShowAlertsModal: (show: boolean) => void;
  
  // Data
  farmer: FarmerProfile;
  setFarmer: (profile: FarmerProfile) => void;
  plots: Plot[];
  setPlots: (plots: Plot[]) => void;
  tasks: FarmTask[];
  toggleTaskStatus: (taskId: string) => Promise<void>;
  alerts: FarmAlert[];
  unreadAlertsCount: number;
  markAlertRead: (alertId: string) => Promise<void>;
  weather: WeatherData | null;
  refreshWeather: () => Promise<void>;
  mandiItems: MandiItem[];
  
  // Voice & Speech
  voiceReadout: boolean;
  setVoiceReadout: (enabled: boolean) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  
  // Reset
  resetAllData: () => void;
}

const defaultFarmer: FarmerProfile = {
  id: 'farmer-1',
  name: 'Ramesh Rao',
  state: 'Telangana',
  district: 'Warangal',
  village: 'Narsampet',
  preferred_language: 'te',
  farm_size: 3.5,
  farm_size_unit: 'Acres',
  water_source: 'Borewell & Drip',
  soil_type: 'Black Cotton Soil',
  current_crop: 'Chilli',
  crop_stage: 'Flowering & Fruiting'
};

const defaultPlots: Plot[] = [
  {
    id: 'plot-1',
    farmer_id: 'farmer-1',
    plot_name: 'North Plot (ఉత్తర చేను)',
    size: 2.0,
    current_crop: 'Chilli',
    crop_variety: 'Teja Guntur Sannam',
    planting_date: '2026-08-10',
    growth_stage: 'Flowering & Fruiting',
    water_source: 'Borewell & Drip',
    soil_type: 'Black Cotton Soil'
  },
  {
    id: 'plot-2',
    farmer_id: 'farmer-1',
    plot_name: 'East Plot (తూర్పు చేను)',
    size: 1.5,
    current_crop: 'Cotton',
    crop_variety: 'Bollgard II',
    planting_date: '2026-07-25',
    growth_stage: 'Boll Formation',
    water_source: 'Borewell',
    soil_type: 'Medium Black Soil'
  }
];

const defaultTasks: FarmTask[] = [
  {
    id: 'task-1',
    stage: 'Flowering & Fruiting',
    title: 'Inspect for Thrips & Leaf Curl (తామర పురుగుల పరిశీలన)',
    description: 'Inspect underside of young terminal leaves for curling or tiny silken webbing in early morning.',
    due_date: '2026-10-01',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'task-2',
    stage: 'Flowering & Fruiting',
    title: 'Foliar Micronutrient Spray (పోషకాల పిచికారీ)',
    description: 'Spray 19:19:19 (5g/L) + Borax after checking 24-hr rain radar advisory.',
    due_date: '2026-10-03',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'task-3',
    stage: 'Crop Protection',
    title: 'Pheromone Trap Check (లింగాకర్షక బుట్టల తనిఖీ)',
    description: 'Count bollworm moths caught in yellow sticky and funnel traps.',
    due_date: '2026-10-02',
    status: 'pending',
    priority: 'high'
  }
];

const defaultAlerts: FarmAlert[] = [
  {
    id: 'alert-1',
    alert_type: 'weather',
    title: 'Precipitation Advisory (వర్ష సూచన)',
    description: 'Light scattered rain (45% probability) forecast in Warangal rural within 36 hours. Postpone foliar spraying.',
    severity: 'warning',
    source: 'IMD / Open-Meteo Weather Radar',
    is_read: false
  },
  {
    id: 'alert-2',
    alert_type: 'pest',
    title: 'Thrips & Mite Surveillance (రసం పీల్చే పురుగుల హెచ్చరిక)',
    description: 'High humidity (78%) creates favorable environment for sucking pests in chilli.',
    severity: 'warning',
    source: 'KVK Warangal Regional Advisory',
    is_read: false
  },
  {
    id: 'alert-3',
    alert_type: 'market',
    title: 'Chilli Mandi Price Surge (మిరప ధర పెరుగుదల)',
    description: 'Warangal Enumamula market modal price touched ₹16,800/Q for Teja variety on Sep 29.',
    severity: 'info',
    source: 'Agmarknet Market Yard',
    is_read: false
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & UI preferences
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('km_language') as Language) || 'te';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('km_text_size') as TextSize) || 'base';
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Modals
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return localStorage.getItem('km_welcome_shown') !== 'true';
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAlertsModal, setShowAlertsModal] = useState<boolean>(false);

  // Data states
  const [farmer, setFarmerState] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem('km_farmer');
    return saved ? JSON.parse(saved) : defaultFarmer;
  });

  const [plots, setPlotsState] = useState<Plot[]>(() => {
    const saved = localStorage.getItem('km_plots');
    return saved ? JSON.parse(saved) : defaultPlots;
  });

  const [tasks, setTasksState] = useState<FarmTask[]>(() => {
    const saved = localStorage.getItem('km_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [alerts, setAlertsState] = useState<FarmAlert[]>(() => {
    const saved = localStorage.getItem('km_alerts');
    return saved ? JSON.parse(saved) : defaultAlerts;
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mandiItems, setMandiItems] = useState<MandiItem[]>([]);
  
  // Voice readout
  const [voiceReadout, setVoiceReadoutState] = useState<boolean>(() => {
    return localStorage.getItem('km_voice_readout') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Update online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync font size class on body
  useEffect(() => {
    document.body.className = `bg-[#F8FAF7] text-[#192E20] antialiased text-size-${textSize}`;
  }, [textSize]);

  // Persist language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('km_language', lang);
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('km_text_size', size);
  };

  const setVoiceReadout = (enabled: boolean) => {
    setVoiceReadoutState(enabled);
    localStorage.setItem('km_voice_readout', enabled ? 'true' : 'false');
  };

  const setFarmer = (profile: FarmerProfile) => {
    setFarmerState(profile);
    localStorage.setItem('km_farmer', JSON.stringify(profile));
    // Also try saving to backend
    fetch('/api/farmer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    }).catch(err => console.warn('Saved profile locally (backend offline):', err));
  };

  const setPlots = (newPlots: Plot[]) => {
    setPlotsState(newPlots);
    localStorage.setItem('km_plots', JSON.stringify(newPlots));
  };

  // Toggle task status
  const toggleTaskStatus = async (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' };
      }
      return t;
    });
    setTasksState(updated);
    localStorage.setItem('km_tasks', JSON.stringify(updated));

    const task = updated.find(t => t.id === taskId);
    if (task) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: task.status })
        });
      } catch (e) {
        console.warn('Updated task locally:', e);
      }
    }
  };

  // Mark alert as read
  const markAlertRead = async (alertId: string) => {
    const updated = alerts.map(a => a.id === alertId ? { ...a, is_read: true } : a);
    setAlertsState(updated);
    localStorage.setItem('km_alerts', JSON.stringify(updated));
    try {
      await fetch(`/api/alerts/${alertId}/read`, { method: 'PUT' });
    } catch (e) {
      console.warn('Updated alert locally:', e);
    }
  };

  // Refresh Weather from backend
  const refreshWeather = async () => {
    try {
      const res = await fetch(`/api/weather?district=${encodeURIComponent(farmer.district || 'Warangal')}&crop=${encodeURIComponent(farmer.current_crop || 'Chilli')}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        localStorage.setItem('km_cached_weather', JSON.stringify(data));
      }
    } catch (e) {
      console.warn('Using cached weather:', e);
      const cached = localStorage.getItem('km_cached_weather');
      if (cached) setWeather(JSON.parse(cached));
    }
  };

  // Fetch initial data
  useEffect(() => {
    refreshWeather();

    // Fetch Mandi prices
    fetch('/api/mandi-prices')
      .then(res => res.json())
      .then(data => {
        if (data && data.markets) {
          setMandiItems(data.markets);
          localStorage.setItem('km_cached_mandi', JSON.stringify(data.markets));
        }
      })
      .catch(() => {
        const cached = localStorage.getItem('km_cached_mandi');
        if (cached) setMandiItems(JSON.parse(cached));
      });
  }, [farmer.district]);

  // Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown asterisks and hash symbols
    const clean = text.replace(/[*#_`]/g, '').trim();
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    
    // Choose appropriate locale
    if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'kn') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.92; // Slightly measured rate for farmer clarity
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Reset data
  const resetAllData = () => {
    localStorage.clear();
    setFarmerState(defaultFarmer);
    setPlotsState(defaultPlots);
    setTasksState(defaultTasks);
    setAlertsState(defaultAlerts);
    setLanguageState('te');
    setShowWelcome(true);
  };

  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;
  const t = translations[language] || translations.te;

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      textSize,
      setTextSize,
      currentScreen,
      setCurrentScreen,
      isOnline,
      showWelcome,
      setShowWelcome,
      showOnboarding,
      setShowOnboarding,
      showAlertsModal,
      setShowAlertsModal,
      farmer,
      setFarmer,
      plots,
      setPlots,
      tasks,
      toggleTaskStatus,
      alerts,
      unreadAlertsCount,
      markAlertRead,
      weather,
      refreshWeather,
      mandiItems,
      voiceReadout,
      setVoiceReadout,
      speakText,
      stopSpeaking,
      isSpeaking,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
