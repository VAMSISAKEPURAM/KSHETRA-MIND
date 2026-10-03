import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw,
  Cpu,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Languages,
  AlertCircle,
  HelpCircle,
  Settings2,
  Zap,
  X
} from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { Language, VoiceAssistantResponse } from '../types';

interface ChatMessage {
  id: string;
  sender: 'farmer' | 'agent';
  text?: string;
  detectedLanguage?: string;
  languageName?: string;
  nativeName?: string;
  confidence?: number;
  structuredResponse?: {
    section_1_understood: string;
    section_2_available_info: string;
    section_3_next_actions: string;
    section_4_why_matters: string;
    section_5_important_caution: string;
  };
  spokenSummary?: string;
  audioBase64?: string;
  agentsInvoked?: string[];
  reasoningEngine?: string;
  timestamp: string;
}

export const AskAiView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage,
    setCurrentScreen, 
    farmer
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingVolume, setRecordingVolume] = useState<number>(0);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [activeOrchestration, setActiveOrchestration] = useState<string[]>([]);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    return localStorage.getItem('km_auto_speak') !== 'false';
  });
  const [detectedLangInfo, setDetectedLangInfo] = useState<{ code: string; name: string; nativeName: string } | null>(null);
  const [errorNotice, setErrorNotice] = useState<{ title: string; message: string; type: 'permission' | 'stt' | 'error' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Load conversation history on mount
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const historyData = await voiceService.getHistory(farmer.id || 'farmer-1');
        if (isMounted && historyData && historyData.length > 0) {
          const loaded: ChatMessage[] = historyData.map((h: any) => ({
            id: h.id,
            sender: h.role === 'farmer' ? 'farmer' : 'agent',
            text: h.text,
            detectedLanguage: h.language,
            structuredResponse: h.structured_response,
            agentsInvoked: h.agents_invoked,
            timestamp: new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(loaded);
          return;
        }
      } catch (e) {
        console.warn('Could not load past conversation history:', e);
      }

      // Check if pending query from Home Dashboard
      const pending = sessionStorage.getItem('km_pending_query');
      if (pending) {
        sessionStorage.removeItem('km_pending_query');
        handleSendText(pending);
      } else if (isMounted && messages.length === 0) {
        // Initial greeting
        setMessages([
          {
            id: 'msg-welcome',
            sender: 'agent',
            text: t.askAiSubtitle,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
      stopAudioPlayback();
      if (isRecording) {
        voiceService.cancelRecording();
      }
    };
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, isRecording]);

  // Save autoSpeak setting
  useEffect(() => {
    localStorage.setItem('km_auto_speak', autoSpeak ? 'true' : 'false');
  }, [autoSpeak]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingSeconds(0);
      setRecordingVolume(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Start / Stop Microphone Recording
  const handleToggleRecording = async () => {
    setErrorNotice(null);

    if (isRecording) {
      // STOP recording & submit audio
      try {
        setIsRecording(false);
        setIsProcessing(true);
        setActiveOrchestration(['Whisper STT', 'Language Classifier']);

        const audioBlob = await voiceService.stopRecording();
        if (audioBlob.size < 500) {
          setErrorNotice({
            title: 'No Speech Detected',
            message: 'Audio was too short or silent. Please tap the microphone and speak again.',
            type: 'stt'
          });
          setIsProcessing(false);
          return;
        }

        // Call backend voice pipeline
        const resp: VoiceAssistantResponse = await voiceService.sendVoiceQuery(
          audioBlob,
          farmer.id || 'farmer-1',
          'auto'
        );

        handleAssistantSuccess(resp);
      } catch (err: any) {
        console.error('Audio processing error:', err);
        setIsProcessing(false);
        if (err.message && err.message.includes('PERMISSION_DENIED')) {
          setErrorNotice({
            title: 'Microphone Permission Needed',
            message: t.voiceMicPermissionError,
            type: 'permission'
          });
        } else {
          setErrorNotice({
            title: 'Speech Recognition Error',
            message: t.voiceSttError,
            type: 'stt'
          });
        }
      }
    } else {
      // START recording
      stopAudioPlayback();
      try {
        await voiceService.startRecording((vol) => {
          setRecordingVolume(vol);
        });
        setIsRecording(true);
      } catch (err: any) {
        console.error('Failed to start recording:', err);
        setIsRecording(false);
        if (err.message && err.message.includes('PERMISSION_DENIED')) {
          setErrorNotice({
            title: 'Microphone Permission Needed',
            message: t.voiceMicPermissionError,
            type: 'permission'
          });
        } else {
          setErrorNotice({
            title: 'Recording Not Available',
            message: err.message || 'Microphone recording could not be started in this browser.',
            type: 'error'
          });
        }
      }
    }
  };

  const handleCancelRecording = () => {
    voiceService.cancelRecording();
    setIsRecording(false);
    setRecordingVolume(0);
  };

  // Send Text Query
  const handleSendText = async (customQuery?: string) => {
    const textToSend = (customQuery || inputQuery).trim();
    if (!textToSend || isProcessing) return;

    stopAudioPlayback();
    setErrorNotice(null);
    setInputQuery('');
    setIsProcessing(true);
    setActiveOrchestration(['Master Agent', 'Language Classifier']);

    try {
      const resp = await voiceService.sendTextQuery(
        textToSend,
        farmer.id || 'farmer-1',
        'auto'
      );
      handleAssistantSuccess(resp);
    } catch (err: any) {
      console.error('Text query failed:', err);
      setIsProcessing(false);
      setErrorNotice({
        title: 'Network Error',
        message: 'Could not connect to KshetraMind Assistant. Please verify your connection.',
        type: 'error'
      });
    }
  };

  // Common response handler for both voice and text queries
  const handleAssistantSuccess = (resp: VoiceAssistantResponse) => {
    setIsProcessing(false);

    if (resp.status !== 'success') {
      setErrorNotice({
        title: 'Assistant Notice',
        message: resp.message || t.voiceSttError,
        type: 'stt'
      });
      return;
    }

    const detected = resp.detected_language || 'te';
    setDetectedLangInfo({
      code: detected,
      name: resp.language_name || detected.toUpperCase(),
      nativeName: resp.native_name || detected.toUpperCase()
    });

    if (resp.agents_invoked) {
      setActiveOrchestration(resp.agents_invoked);
    }

    // 1. Add Farmer Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'farmer',
      text: resp.transcription,
      detectedLanguage: detected,
      languageName: resp.language_name,
      nativeName: resp.native_name,
      confidence: resp.confidence,
      timestamp: resp.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 2. Add Agent Response Message
    const agentMsgId = `agent-${Date.now() + 1}`;
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      sender: 'agent',
      structuredResponse: resp.structured_response,
      spokenSummary: resp.spoken_summary,
      audioBase64: resp.audio_base64,
      agentsInvoked: resp.agents_invoked,
      reasoningEngine: resp.reasoning_engine,
      detectedLanguage: detected,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);

    // 3. Auto-play generated speech
    if (autoSpeak && resp.audio_base64) {
      playAudioMessage(agentMsgId, resp.audio_base64);
    }
  };

  // Audio Playback
  const playAudioMessage = (msgId: string, audioBase64?: string, textFallback?: string) => {
    stopAudioPlayback();

    if (audioBase64) {
      setPlayingMessageId(msgId);
      audioElementRef.current = voiceService.playAudio(
        audioBase64,
        () => setPlayingMessageId(msgId),
        () => setPlayingMessageId(null),
        () => setPlayingMessageId(null),
        playbackSpeed
      );
    } else if (textFallback) {
      // Fallback: request TTS on demand
      voiceService.synthesizeSpeech(textFallback, (detectedLangInfo?.code as Language) || language).then((b64) => {
        if (b64) {
          playAudioMessage(msgId, b64);
        }
      });
    }
  };

  const stopAudioPlayback = () => {
    voiceService.stopAudio();
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
      } catch (e) {}
      audioElementRef.current = null;
    }
    setPlayingMessageId(null);
  };

  const togglePlaybackSpeed = () => {
    const speeds = [1.0, 1.2, 0.8];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    voiceService.setPlaybackRate(nextSpeed);
  };

  const handleClearHistory = async () => {
    if (confirm('సంభాషణ చరిత్రను తుడిపివేయాలనుకుంటున్నారా? / Clear conversation history?')) {
      await voiceService.clearHistory(farmer.id || 'farmer-1');
      setMessages([
        {
          id: 'msg-cleared',
          sender: 'agent',
          text: t.voiceHistoryCleared,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setDetectedLangInfo(null);
    }
  };

  const sampleQuestions = [
    t.sampleQ1,
    t.sampleQ2,
    t.sampleQ3,
    t.sampleQ4
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] pb-1 pt-1 max-w-3xl mx-auto font-sans">
      
      {/* Top Header & Voice Assistant Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-100/80 shadow-sm mx-1 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('home')}
            className="min-h-[40px] px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-100 transition active:scale-95"
            title={t.backBtn}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.backBtn}</span>
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#133E2F]">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{t.voiceAssistantTitle || 'Multilingual Voice Assistant'}</span>
            </div>
            {detectedLangInfo && (
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Languages className="w-3 h-3 text-[#2E7D32]" />
                <span>Auto: {detectedLangInfo.name} ({detectedLangInfo.nativeName})</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Agents Badge */}
          {activeOrchestration.length > 0 && (
            <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <Cpu className="w-3 h-3 text-[#2E7D32]" />
              <span>{activeOrchestration.slice(0, 2).join(' + ')}</span>
            </div>
          )}

          {/* Auto-Readout Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`min-h-[38px] px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              autoSpeak 
                ? 'bg-emerald-50 text-[#2E7D32] border-emerald-300' 
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-gray-700'
            }`}
            title="Auto-read AI responses aloud"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{autoSpeak ? 'Audio ON' : 'Audio OFF'}</span>
          </button>

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            className="min-h-[38px] p-2 rounded-xl bg-gray-50 text-gray-500 border border-gray-200 hover:text-rose-600 hover:bg-rose-50 transition"
            title={t.voiceClearHistory || 'Clear History'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error / Permission Diagnostic Alert */}
      {errorNotice && (
        <div className="mx-2 mb-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-3 text-amber-900 animate-in fade-in duration-200">
          <div className="flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{errorNotice.title}</span>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">{errorNotice.message}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorNotice(null)}
            className="text-amber-700 hover:text-amber-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
        {messages.map((msg) => {
          // Farmer Message
          if (msg.sender === 'farmer') {
            return (
              <div key={msg.id} className="flex justify-end animate-in fade-in duration-200">
                <div className="max-w-[88%] sm:max-w-[78%] bg-[#133E2F] text-white p-4 rounded-3xl rounded-tr-sm shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-emerald-700/40 pb-1">
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                      <span>🗣️ {farmer.name || 'Farmer'}</span>
                      {msg.nativeName && (
                        <span className="bg-emerald-800/80 px-1.5 py-0.2 rounded text-[10px] text-emerald-200">
                          {msg.nativeName}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-emerald-300/70">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          }

          // Agent Response: 5-Section Agricultural Advisory Card
          if (msg.structuredResponse) {
            const resp = msg.structuredResponse;
            const isPlaying = playingMessageId === msg.id;

            return (
              <div key={msg.id} className="flex justify-start animate-in fade-in duration-200">
                <div className="max-w-[96%] sm:max-w-[92%] bg-white rounded-3xl p-5 border border-emerald-200 shadow-xl space-y-3.5">
                  
                  {/* Master Agent Header & Voice Playback Controls */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2E7D32]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#133E2F] flex items-center gap-1.5 flex-wrap">
                          <span>{t.appName} (Master Agent)</span>
                          {msg.reasoningEngine && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{msg.reasoningEngine}</span>
                            </span>
                          )}
                        </div>
                        {msg.agentsInvoked && msg.agentsInvoked.length > 0 && (
                          <div className="text-[10px] text-gray-400">
                            {msg.agentsInvoked.join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Audio Controls Bar */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={togglePlaybackSpeed}
                        className="text-[11px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        title="Change audio playback speed"
                      >
                        {playbackSpeed}x
                      </button>

                      {isPlaying ? (
                        <button
                          onClick={stopAudioPlayback}
                          className="min-h-[36px] px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1.5 animate-pulse shadow-sm"
                          title={t.voicePauseAudio || 'Pause'}
                        >
                          <Pause className="w-4 h-4 fill-rose-800" />
                          <span>{t.voicePauseAudio || 'Pause'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => playAudioMessage(msg.id, msg.audioBase64, msg.spokenSummary)}
                          className="min-h-[36px] px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                          title={t.voicePlayAudio || 'Listen'}
                        >
                          <Play className="w-4 h-4 fill-[#2E7D32]" />
                          <span>{t.listenBtn || 'Listen'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Audio Waveform Indicator when Playing */}
                  {isPlaying && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
                      <div className="flex items-center gap-2 font-bold">
                        <Volume2 className="w-4 h-4 text-[#2E7D32] animate-bounce" />
                        <span>{t.voiceSpeaking || 'Speaking response...'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-3 bg-[#2E7D32] rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-5 bg-[#2E7D32] rounded-full animate-pulse delay-75"></span>
                        <span className="w-1.5 h-2 bg-[#2E7D32] rounded-full animate-pulse delay-150"></span>
                        <span className="w-1.5 h-4 bg-[#2E7D32] rounded-full animate-pulse delay-100"></span>
                      </div>
                    </div>
                  )}

                  {/* Spoken Summary Highlight (Conversational takeaway) */}
                  {msg.spokenSummary && (
                    <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/80">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                        📢 {language === 'te' ? 'వాయిస్ సారాంశం' : language === 'hi' ? 'ऑडियो सारांश' : language === 'ta' ? 'குரல் சுருக்கம்' : language === 'kn' ? 'ಧ್ವನಿ ಸಾರಾಂಶ' : language === 'ml' ? 'ശബ്ദ സംഗ്രഹം' : language === 'mr' ? 'ऑडिओ सारांश' : language === 'bn' ? 'ভয়েস সারাংশ' : 'Quick Audio Summary'}
                      </span>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        {msg.spokenSummary}
                      </p>
                    </div>
                  )}

                  {/* SECTION 1: What I understood */}
                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1">
                      {t.sec1Understood}
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                      {resp.section_1_understood}
                    </p>
                  </div>

                  {/* SECTION 2: What available info shows */}
                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1">
                      {t.sec2InfoShows}
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {resp.section_2_available_info}
                    </p>
                  </div>

                  {/* SECTION 3: What you can check or do next */}
                  <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide block mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>{t.sec3NextSteps}</span>
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                      {resp.section_3_next_actions}
                    </p>
                  </div>

                  {/* SECTION 4: Why this matters */}
                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1">
                      {t.sec4WhyMatters}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {resp.section_4_why_matters}
                    </p>
                  </div>

                  {/* SECTION 5: Important caution */}
                  <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-rose-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{t.sec5Caution}</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      {resp.section_5_important_caution}
                    </p>
                  </div>

                </div>
              </div>
            );
          }

          // Simple Welcome Message
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[85%] bg-white rounded-3xl p-4 border border-emerald-100 shadow-sm text-sm text-gray-800 space-y-2">
                <p className="leading-relaxed">{msg.text}</p>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>{t.voiceMicPrompt || 'Tap the green microphone below and speak in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, or English!'}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / AI Orchestration Spinner */}
        {isProcessing && (
          <div className="flex justify-start animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-md flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#2E7D32] animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-900">
                  {t.voiceProcessing || 'Processing speech and orchestrating agricultural agents...'}
                </div>
                <div className="text-[11px] text-emerald-700">
                  Transcribing with Whisper & querying Weather, Soil, and Market models...
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      {!isRecording && (
        <div className="px-2 py-1 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendText(q)}
              className="text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm shrink-0 transition active:scale-95 flex items-center gap-1"
            >
              <span>💬</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}

      {/* LIVE RECORDING WAVEFORM OVERLAY */}
      {isRecording && (
        <div className="mx-2 p-3.5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-lg flex flex-col gap-2.5 shrink-0 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <span className="text-xs font-bold text-rose-800">
                {t.voiceListening || 'Listening to your voice...'} (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})
              </span>
            </div>

            <button
              onClick={handleCancelRecording}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg"
            >
              {t.cancelBtn || 'Cancel'}
            </button>
          </div>

          {/* Live Waveform Audio Level Meter */}
          <div className="flex items-center justify-center gap-1.5 h-10 px-4 bg-white/70 rounded-2xl border border-rose-200">
            {[20, 45, 80, 50, 95, 60, 100, 75, 40, 85, 30].map((baseHeight, idx) => {
              const dynamicHeight = Math.max(12, Math.min(36, (recordingVolume / 100) * baseHeight));
              return (
                <div
                  key={idx}
                  style={{ height: `${dynamicHeight}px` }}
                  className="w-1.5 bg-rose-600 rounded-full transition-all duration-75 ease-out"
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-rose-700 font-medium">
            <span>{t.voiceWaveformPrompt || 'Speak clearly in any Indian language'}</span>
            <button
              onClick={handleToggleRecording}
              className="px-3 py-1 bg-rose-600 text-white font-bold rounded-xl shadow-sm hover:bg-rose-700 transition"
            >
              {t.voiceStopPrompt || 'Done Speaking'}
            </button>
          </div>
        </div>
      )}

      {/* Input Box Footer (56px Touch Target) */}
      <div className="px-2 pt-1 shrink-0">
        <div className="bg-white rounded-3xl p-2 border border-emerald-200 shadow-xl flex items-center gap-2">
          
          {/* Main Microphone Button */}
          <button
            onClick={handleToggleRecording}
            className={`min-h-[52px] min-w-[52px] rounded-2xl flex items-center justify-center transition active:scale-95 shadow-md ${
              isRecording 
                ? 'bg-rose-600 text-white shadow-rose-300 animate-pulse ring-4 ring-rose-200' 
                : 'bg-[#2E7D32] hover:bg-[#256628] text-white'
            }`}
            title={isRecording ? t.voiceStopPrompt : t.askMicButton}
            aria-label={isRecording ? t.voiceStopPrompt : t.askMicButton}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendText();
            }}
            placeholder={isRecording ? (t.speakNowPrompt || 'Listening... speak now') : t.askBannerPlaceholder}
            disabled={isRecording || isProcessing}
            className="flex-1 min-h-[48px] px-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendText()}
            disabled={!inputQuery.trim() || isProcessing || isRecording}
            className="min-h-[48px] min-w-[48px] rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-[#133E2F] flex items-center justify-center transition disabled:opacity-30 active:scale-95 shadow-sm"
            title={t.askSendButton}
            aria-label={t.askSendButton}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
