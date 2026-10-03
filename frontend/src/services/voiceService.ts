import { API_BASE_URL } from '../config/api';
import { VoiceAssistantResponse, Language, LLMStatus } from '../types';

export interface AudioVisualizerCallback {
  (volume: number): void;
}

class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  /**
   * Checks if audio recording is supported in this browser.
   */
  public isRecordingSupported(): boolean {
    return Boolean(
      typeof window !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  /**
   * Starts recording user microphone audio with live volume visualization.
   */
  public async startRecording(onVolume?: AudioVisualizerCallback): Promise<void> {
    this.audioChunks = [];

    if (!this.isRecordingSupported()) {
      throw new Error('NOT_SUPPORTED: Microphone recording is not supported in this browser.');
    }

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('PERMISSION_DENIED: Microphone access was denied. Please allow microphone permissions in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('NO_MIC: No microphone input device found.');
      } else {
        throw new Error(`MIC_ERROR: Could not access microphone: ${err.message || err.name}`);
      }
    }

    // Set up AudioContext for real-time waveform / volume meter
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && onVolume) {
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(this.audioStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((average / 128) * 100));
          onVolume(normalized);
          this.animFrameId = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (e) {
      console.warn('AudioContext visualization setup error:', e);
    }

    // Determine supported mime type
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    let selectedMime = '';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    const options: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
    this.mediaRecorder = new MediaRecorder(this.audioStream, options);

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(200); // 200ms time slice
  }

  /**
   * Stops recording and returns recorded audio Blob.
   */
  public async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('NO_RECORDER: MediaRecorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.cleanupAudioTracks();
        resolve(audioBlob);
      };

      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
      } catch (e) {
        this.cleanupAudioTracks();
        reject(e);
      }
    });
  }

  /**
   * Cancels active recording without returning audio.
   */
  public cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    this.cleanupAudioTracks();
    this.audioChunks = [];
  }

  private cleanupAudioTracks(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((t) => t.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
    this.mediaRecorder = null;
  }

  /**
   * Sends voice audio blob to backend multilingual assistant pipeline.
   */
  public async sendVoiceQuery(
    audioBlob: Blob,
    farmerId: string = 'farmer-1',
    preferredLanguage: string = 'auto'
  ): Promise<VoiceAssistantResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_recording.webm');
    formData.append('farmer_id', farmerId);
    formData.append('language', preferredLanguage);
    formData.append('synthesize_voice', 'true');

    const res = await fetch(`${API_BASE_URL}/api/voice/assistant`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Voice Assistant API error (${res.status}): ${errText}`);
    }

    return await res.json();
  }

  /**
   * Sends text query with automatic language detection and neural voice synthesis.
   */
  public async sendTextQuery(
    queryText: string,
    farmerId: string = 'farmer-1',
    preferredLanguage: string = 'auto'
  ): Promise<VoiceAssistantResponse> {
    const formData = new FormData();
    formData.append('query', queryText);
    formData.append('farmer_id', farmerId);
    formData.append('language', preferredLanguage);
    formData.append('synthesize_voice', 'true');

    const res = await fetch(`${API_BASE_URL}/api/voice/assistant`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Assistant API error (${res.status}): ${errText}`);
    }

    return await res.json();
  }

  /**
   * Synthesizes text to speech audio via backend Neural TTS.
   */
  public async synthesizeSpeech(
    text: string,
    language: Language = 'te',
    gender: 'female' | 'male' = 'female'
  ): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, gender })
      });
      if (res.ok) {
        const data = await res.json();
        return data.audio_base64 || null;
      }
    } catch (e) {
      console.warn('TTS request error:', e);
    }
    return null;
  }

  /**
   * Plays audio from base64 data URI or stream URL with event listeners.
   */
  public playAudio(
    audioUrl: string,
    onStart?: () => void,
    onEnded?: () => void,
    onError?: (err: any) => void,
    playbackRate: number = 1.0
  ): HTMLAudioElement {
    this.stopAudio();

    const audio = new Audio(audioUrl);
    audio.playbackRate = playbackRate;
    this.currentAudioElement = audio;

    if (onStart) audio.onplay = () => onStart();
    if (onEnded) audio.onended = () => {
      this.currentAudioElement = null;
      onEnded();
    };
    if (onError) audio.onerror = (e) => {
      this.currentAudioElement = null;
      onError(e);
    };

    audio.play().catch((err) => {
      console.warn('Audio play prevented or interrupted:', err);
      if (onError) onError(err);
    });

    return audio;
  }

  /**
   * Pauses or stops currently playing audio.
   */
  public stopAudio(): void {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {}
      this.currentAudioElement = null;
    }
  }

  /**
   * Changes speed of playing audio.
   */
  public setPlaybackRate(rate: number): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = rate;
    }
  }

  /**
   * Clears conversation history for the farmer.
   */
  public async clearHistory(farmerId: string = 'farmer-1'): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/voice/history/${farmerId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Failed to clear voice history on backend:', e);
    }
  }

  /**
   * Loads past voice conversation history.
   */
  public async getHistory(farmerId: string = 'farmer-1'): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/voice/history/${farmerId}`);
      if (res.ok) {
        const data = await res.json();
        return data.history || [];
      }
    } catch (e) {
      console.warn('Failed to fetch voice history:', e);
    }
    return [];
  }

  /**
   * Fetches Groq LLM reasoning status and supported models.
   */
  public async getLLMStatus(): Promise<LLMStatus> {
    const res = await fetch(`${API_BASE_URL}/api/llm/status`);
    if (!res.ok) {
      throw new Error(`Failed to fetch LLM status: ${res.statusText}`);
    }
    return await res.json();
  }

  /**
   * Configures Groq API key and reasoning model.
   */
  public async configureLLM(apiKey: string, model: string = 'llama-3.3-70b-versatile'): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/llm/configure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, model })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to configure LLM: ${err}`);
    }
    return await res.json();
  }

  /**
   * Tests live connection to Groq API.
   */
  public async testLLMConnection(apiKey?: string, model?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/llm/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey || '', model: model || 'llama-3.3-70b-versatile' })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Test failed: ${err}`);
    }
    return await res.json();
  }
}

export const voiceService = new VoiceService();
