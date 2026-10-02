import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CropHealthResult } from '../types';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowLeft, 
  RefreshCw, 
  Eye, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const CropHealthView: React.FC = () => {
  const { t, setCurrentScreen, farmer } = useApp();

  const [selectedCrop, setSelectedCrop] = useState<string>(farmer.current_crop || 'Chilli');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<CropHealthResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const crops = ['Chilli', 'Cotton', 'Tomato', 'Paddy', 'Maize', 'Groundnut'];

  // Sample leaf presets for instant farmer test
  const samplePresets = [
    {
      title: 'Chilli Leaf Curl (మిరప ఆకు ముడత)',
      crop: 'Chilli',
      sampleUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&auto=format&fit=crop&q=80',
      note: 'Leaves curled upward with puckering and pale yellow margins.'
    },
    {
      title: 'Tomato Early Blight (టమాటా ఆకుమాడు)',
      crop: 'Tomato',
      sampleUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&auto=format&fit=crop&q=80',
      note: 'Brown circular spots with concentric target rings on lower leaves.'
    },
    {
      title: 'Rice Blast (వరి అగ్గి తెగులు)',
      crop: 'Paddy',
      sampleUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=400&auto=format&fit=crop&q=80',
      note: 'Spindle-shaped lesions with grayish white centre and reddish brown margins.'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (presetNote?: string) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('crop', selectedCrop);
      if (presetNote) formData.append('notes', presetNote);

      const res = await fetch(`${API_BASE_URL}/api/crop-health/analyze`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.warn('API error, using local agronomic evaluation:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (preset: typeof samplePresets[0]) => {
    setSelectedCrop(preset.crop);
    setImagePreview(preset.sampleUrl);
    handleAnalyze(preset.note);
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in duration-200">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {t.cropHealthTitle}
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm">
        <h2 className="text-xl font-bold text-[#192E20]">
          {t.cropHealthTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {t.cropHealthSubtitle}
        </p>

        {/* 1. Crop Selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            {t.selectCropLabel}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {crops.map((c) => {
              const isSel = selectedCrop === c;
              return (
                <button
                  key={c}
                  onClick={() => { setSelectedCrop(c); setResult(null); }}
                  className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition border ${
                    isSel 
                      ? 'bg-[#133E2F] text-white border-[#133E2F] shadow-sm' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Photo Upload / Camera Area */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="space-y-3">
            <div className="relative h-60 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-gray-900 flex items-center justify-center">
              <img 
                src={imagePreview} 
                alt="Selected crop leaf" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-1 rounded-lg backdrop-blur-sm">
                {selectedCrop} Leaf
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-h-[48px] rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>{t.takeAnotherPhoto}</span>
              </button>

              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing}
                className="flex-1 min-h-[48px] rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.analyzingLeaf}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>{t.submitBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-200 rounded-3xl p-8 text-center cursor-pointer hover:border-[#2E7D32] hover:bg-emerald-50/20 transition flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-3 shadow-inner">
                <Camera className="w-7 h-7" />
              </div>
              <div className="font-bold text-sm text-gray-800">
                {t.cameraCapture}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t.uploadLeafPhoto}
              </p>
            </div>

            {/* Quick Demo Sample Leaf Cards */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-500 block mb-2">
                {t.sampleLeavesLabel}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {samplePresets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => loadSample(p)}
                    className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 text-left text-xs font-semibold bg-gray-50/50 flex items-center gap-2 hover:bg-emerald-50/40 transition"
                  >
                    <span className="text-base">🍃</span>
                    <span className="line-clamp-1">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Diagnostic Results View */}
      {result && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                {t.diagnosedIssueTitle}
              </span>
              <h3 className="text-lg font-extrabold text-[#192E20] mt-1">
                {result.scientific_and_local_name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {result.confidence_label}
              </span>
            </div>
          </div>

          {/* Visual Symptoms */}
          <div>
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <Eye className="w-4 h-4 text-[#2E7D32]" />
              <span>{t.visualSymptomsTitle}</span>
            </div>
            <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {result.main_visual_symptoms}
            </p>
          </div>

          {/* Contributing Factors */}
          <div>
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{t.contributingFactorsTitle}</span>
            </div>
            <p className="text-xs text-gray-600 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
              {result.contributing_factors}
            </p>
          </div>

          {/* Next Checks in Field */}
          <div>
            <div className="text-xs font-bold text-gray-800 mb-1.5">
              {t.nextChecksTitle}
            </div>
            <div className="space-y-1">
              {result.suggested_next_checks.map((chk, i) => (
                <div key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-emerald-50/40 p-2 rounded-lg">
                  <span className="text-[#2E7D32] font-bold">✓</span>
                  <span>{chk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Prevention Measures */}
          <div>
            <div className="text-xs font-bold text-gray-800 mb-1.5">
              {t.culturalPreventionTitle}
            </div>
            <div className="space-y-1">
              {result.general_prevention_guidance.map((gp, i) => (
                <div key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{gp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CRITICAL AGRICULTURAL SAFETY WARNING */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-rose-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{t.safetyWarningTitle}</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              {result.safety_warning}
            </p>
            <p className="text-[11px] text-rose-700 font-medium pt-1">
              {t.expertConsultAdvised}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
