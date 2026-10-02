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
  CheckCircle, 
  Layers, 
  Camera, 
  RefreshCw,
  Cpu,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'farmer' | 'agent';
  text?: string;
  structuredResponse?: {
    section_1_understood: string;
    section_2_available_info: string;
    section_3_next_actions: string;
    section_4_why_matters: string;
    section_5_important_caution: string;
  };
  agentsInvoked?: string[];
  timestamp: string;
}

export const AskAiView: React.FC = () => {
  const { 
    t, 
    language, 
    setCurrentScreen, 
    farmer, 
    speakText, 
    stopSpeaking, 
    isSpeaking,
    voiceReadout 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeOrchestration, setActiveOrchestration] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check if pending query from Home Dashboard
  useEffect(() => {
    const pending = sessionStorage.getItem('km_pending_query');
    if (pending) {
      sessionStorage.removeItem('km_pending_query');
      handleSend(pending);
    } else if (messages.length === 0) {
      // Initial greeting from Master Agent
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'agent',
          text: t.askAiSubtitle,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Web Speech API: Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Map language
      if (language === 'te') recognition.lang = 'te-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'kn') recognition.lang = 'kn-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSend(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
        }
      } else {
        alert('Voice input is not supported in this browser. Please use Google Chrome or Edge.');
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'farmer',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);
    setActiveOrchestration(['Master Agent', 'Intent Parser']);

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language,
          farmer_id: farmer.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveOrchestration(data.agents_invoked || []);

        const agentMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          structuredResponse: data.response,
          agentsInvoked: data.agents_invoked,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, agentMsg]);

        // Auto read-aloud if setting enabled
        if (voiceReadout && data.response) {
          const speech = `${data.response.section_1_understood}. ${data.response.section_3_next_actions}. ${data.response.section_5_important_caution}`;
          speakText(speech);
        }
      }
    } catch (e) {
      console.warn('Master Agent query error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleQuestions = [
    t.sampleQ1,
    t.sampleQ2,
    t.sampleQ3,
    t.sampleQ4
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] pb-1 pt-1 max-w-3xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-2 py-1.5 shrink-0">
        <button
          onClick={() => setCurrentScreen('home')}
          className="min-h-[44px] px-3 py-1 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 flex items-center gap-1.5 text-xs hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Active Agents Badge */}
          {activeOrchestration.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Cpu className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{activeOrchestration.join(' + ')}</span>
            </div>
          )}

          {/* Voice Stop/Play toggle */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="min-h-[44px] px-3 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1.5 animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span>{t.stopAudioBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
        
        {messages.map((msg) => {
          if (msg.sender === 'farmer') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] bg-[#133E2F] text-white p-4 rounded-3xl rounded-tr-sm shadow-md">
                  <p className="text-sm font-semibold">{msg.text}</p>
                  <span className="text-[10px] text-emerald-300/70 block text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          // Agent Response: Render in the 5 MANDATORY STRUCTURED SECTIONS
          if (msg.structuredResponse) {
            const resp = msg.structuredResponse;
            const fullSpeech = `${resp.section_1_understood}. ${resp.section_2_available_info}. ${resp.section_3_next_actions}. ${resp.section_5_important_caution}`;

            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[95%] sm:max-w-[90%] bg-white rounded-3xl p-5 border border-emerald-200 shadow-lg space-y-3.5">
                  
                  {/* Master Agent Coordination Badge */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#133E2F]">
                      <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                      <span>{t.appName} (Master Agent)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(fullSpeech)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        title={t.readAloudBtn}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* SECTION 1: What I understood */}
                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/70">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide block mb-1">
                      {t.sec1Understood}
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                      {resp.section_1_understood}
                    </p>
                  </div>

                  {/* SECTION 2: What available info shows */}
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1">
                      {t.sec2InfoShows}
                    </span>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {resp.section_2_available_info}
                    </p>
                  </div>

                  {/* SECTION 3: What you can check or do next */}
                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide block mb-1">
                      {t.sec3NextSteps}
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                      {resp.section_3_next_actions}
                    </p>
                  </div>

                  {/* SECTION 4: Why this matters */}
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
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
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>{t.sec5Caution}</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      {resp.section_5_important_caution}
                    </p>
                  </div>

                  {/* Active Agents Footnote */}
                  {msg.agentsInvoked && (
                    <div className="text-[10px] text-gray-400 pt-1 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-gray-400" />
                      <span>Orchestrated: {msg.agentsInvoked.join(', ')}</span>
                    </div>
                  )}

                </div>
              </div>
            );
          }

          // Simple intro message
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[85%] bg-white rounded-3xl p-4 border border-emerald-100 shadow-sm text-sm text-gray-800">
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Loading Orchestrator State */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#2E7D32] animate-spin" />
              <div>
                <div className="text-xs font-bold text-gray-800">
                  {t.masterAgentOrchestrating}
                </div>
                <div className="text-[11px] text-gray-400">
                  Querying Weather, Soil, and Market models in parallel...
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-2 py-1 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xl shrink-0 transition active:scale-95"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Speech Listening Banner */}
      {isListening && (
        <div className="mx-2 p-2.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center justify-between animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
            <span>{t.listeningNow} ({language.toUpperCase()})</span>
          </div>
          <button 
            onClick={toggleListening}
            className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-lg"
          >
            {t.stopAudioBtn}
          </button>
        </div>
      )}

      {/* Input Box Footer (56px touch target) */}
      <div className="px-2 pt-1 shrink-0">
        <div className="bg-white rounded-3xl p-2 border border-emerald-200 shadow-lg flex items-center gap-2">
          
          {/* Mic Button */}
          <button
            onClick={toggleListening}
            className={`min-h-[48px] min-w-[48px] rounded-2xl flex items-center justify-center transition active:scale-95 ${
              isListening 
                ? 'bg-rose-600 text-white shadow-md animate-pulse ring-4 ring-rose-200' 
                : 'bg-emerald-50 text-[#2E7D32] hover:bg-emerald-100'
            }`}
            title={t.askMicButton}
            aria-label={t.askMicButton}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={isListening ? t.speakNowPrompt : t.askBannerPlaceholder}
            className="flex-1 min-h-[48px] px-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isProcessing}
            className="min-h-[48px] min-w-[48px] rounded-2xl bg-[#2E7D32] hover:bg-[#256628] text-white flex items-center justify-center transition disabled:opacity-40 active:scale-95 shadow-sm"
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
