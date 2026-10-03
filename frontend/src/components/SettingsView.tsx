import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language, TextSize, LLMStatus } from '../types';
import { voiceService } from '../services/voiceService';
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
  ExternalLink,
  Cpu,
  Zap,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2
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

  const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-oss-120b');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency_ms?: number } | null>(null);

  useEffect(() => {
    loadLlmStatus();
  }, []);

  const loadLlmStatus = async () => {
    try {
      const status = await voiceService.getLLMStatus();
      setLlmStatus(status);
      if (status.active_model) {
        setSelectedModel(status.active_model);
      }
    } catch (e) {
      console.warn('Could not fetch LLM status:', e);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await voiceService.testLLMConnection(apiKeyInput || undefined, selectedModel);
      if (res.success) {
        setTestResult({
          success: true,
          message: `Connected to ${res.model} successfully! Latency: ${res.latency_ms}ms`,
          latency_ms: res.latency_ms
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Connection failed'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to reach backend test endpoint'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!apiKeyInput.trim() && !llmStatus?.has_api_key) {
      alert('Please enter a Groq API key.');
      return;
    }
    setIsSaving(true);
    setTestResult(null);
    try {
      const res = await voiceService.configureLLM(apiKeyInput, selectedModel);
      if (res.llm_status) {
        setLlmStatus(res.llm_status);
      }
      if (res.test_result?.success) {
        setTestResult({
          success: true,
          message: `Groq LLM verified & saved! Latency: ${res.test_result.latency_ms}ms`,
          latency_ms: res.test_result.latency_ms
        });
        setApiKeyInput('');
      } else {
        setTestResult({
          success: res.status === 'success',
          message: res.message
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error saving Groq configuration'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const languagesList: { code: Language; name: string; nativeName: string }[] = [
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
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

      {/* 5. Groq LLM Reasoning Engine Configuration */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
            <Cpu className="w-4 h-4 text-[#2E7D32]" />
            <span>Groq LLM Reasoning Engine</span>
          </div>

          {llmStatus?.is_available ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active ({llmStatus.active_model.includes('deepseek') ? 'DeepSeek R1' : 'Llama 3.3 70B'})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Rule Engine Fallback</span>
            </span>
          )}
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Groq Cloud powers high-throughput multi-agent agronomic synthesis across Weather, Soil, Pest Diagnosis, and Mandi price agents using advanced 70B parameter models.
        </p>

        {/* Model Selection */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 block">
            Reasoning Model
          </label>
          <div className="grid grid-cols-1 gap-2">
            {(llmStatus?.supported_models || [
              { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B Reasoning Flagship', description: 'Massive 120-Billion parameter advanced agronomic reasoning engine on Groq LPU', recommended: true, speed: 'Fast (~220 tps)' },
              { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B High-Speed', description: '20-Billion parameter high-throughput reasoning model on Groq LPU', recommended: false, speed: 'Very Fast (~450 tps)' },
              { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', description: 'State-of-the-art multilingual agricultural reasoning', recommended: false, speed: 'Very Fast (~280 tps)' },
              { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill Llama 70B', description: 'High-capability reasoning and agronomic diagnostic chain-of-thought', recommended: false, speed: 'Fast (~250 tps)' },
              { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', description: 'Ultra-low latency lightweight model for instant advice', recommended: false, speed: 'Blazing (~560 tps)' }
            ]).map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-[#2E7D32] bg-emerald-50/70 shadow-xs'
                      : 'border-gray-200 bg-gray-50/40 hover:border-emerald-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{model.name}</span>
                      {model.recommended && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-600 text-white tracking-wide">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">{model.description}</p>
                    <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
                      ⚡ Speed: {model.speed}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-gray-700">
              Groq API Key
            </label>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#2E7D32] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={llmStatus?.masked_key ? `Configured (${llmStatus.masked_key})` : 'Enter gsk_... API key'}
              className="w-full text-xs font-mono px-3 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {llmStatus?.has_api_key && !apiKeyInput && (
            <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>API Key configured on server ({llmStatus.masked_key}). Enter new key to update.</span>
            </div>
          )}
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">
              <div className="font-bold">{testResult.success ? 'Verified Successfully' : 'Test Error'}</div>
              <div>{testResult.message}</div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || (!apiKeyInput.trim() && !llmStatus?.has_api_key)}
            className="flex-1 min-h-[42px] px-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={isSaving || (!apiKeyInput.trim() && selectedModel === llmStatus?.active_model)}
            className="flex-1 min-h-[42px] px-3 rounded-xl bg-[#2E7D32] hover:bg-[#256628] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving...' : 'Save & Activate'}</span>
          </button>
        </div>

        {/* Fallback Guarantee */}
        <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200/70 leading-relaxed">
          <span className="font-bold text-gray-700">🛡️ Zero-Failure Fallback: </span>
          If Groq API key is omitted, exhausted, or offline, KshetraMind automatically uses the built-in local multi-agent synthesis engine with zero interruption.
        </div>
      </div>

      {/* 6. Offline Support Info */}
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
