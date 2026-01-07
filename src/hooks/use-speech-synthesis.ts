'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeechSynthesisState {
  isSpeaking: boolean;
  isSupported: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
}

interface SpeechSynthesisActions {
  speak: (text: string) => void;
  speakWithCallback: (text: string, onEnd: () => void) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
}

/**
 * Custom hook for Web Speech API (Text-to-Speech)
 * Provides voice output for AI responses in interview
 */
export function useSpeechSynthesis(options: {
  language?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}): [SpeechSynthesisState, SpeechSynthesisActions] {
  const { language = 'en-US', onStart, onEnd, onError } = options;

  const [state, setState] = useState<SpeechSynthesisState>({
    isSpeaking: false,
    isSupported: false,
    isPaused: false,
    voices: [],
    selectedVoice: null,
    rate: 1,
    pitch: 1,
  });

  // Use refs to keep callbacks stable
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStartRef.current = onStart;
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
  }, [onStart, onEnd, onError]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize and check for support
  useEffect(() => {
    const SpeechSynthesis = window.speechSynthesis;
    const isSupported = !!SpeechSynthesis;

    synthRef.current = SpeechSynthesis;

    setState(prev => ({ ...prev, isSupported }));

    if (isSupported) {
      // Load available voices
      const loadVoices = () => {
        const voices = SpeechSynthesis.getVoices();
        setState(prev => {
          // Filter voices by language preference
          const filteredVoices = language
            ? voices.filter(v => v.lang.startsWith(language))
            : voices;

          // Try to select a natural voice
          const selectedVoice =
            prev.selectedVoice ||
            filteredVoices.find(
              v =>
                v.name.includes('Natural') ||
                v.name.includes('Google US English') ||
                v.lang === 'en-US'
            ) ||
            filteredVoices[0] ||
            null;

          return {
            ...prev,
            voices: filteredVoices,
            selectedVoice,
          };
        });
      };

      loadVoices();

      // Voices might load asynchronously
      if (SpeechSynthesis.onvoiceschanged !== undefined) {
        SpeechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !state.isSupported) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      if (state.selectedVoice) {
        utterance.voice = state.selectedVoice;
      }

      utterance.rate = state.rate;
      utterance.pitch = state.pitch;
      utterance.lang = language;

      utterance.onstart = () => {
        setState(prev => ({ ...prev, isSpeaking: true, isPaused: false }));
        onStartRef.current?.();
      };

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false, isPaused: false }));
        onEndRef.current?.();
      };

      utterance.onerror = event => {
        console.error('Speech synthesis error:', event.error);
        setState(prev => ({ ...prev, isSpeaking: false }));
        onErrorRef.current?.(event.error);
      };

      synthRef.current.speak(utterance);
    },
    [state.isSupported, state.selectedVoice, state.rate, state.pitch, language]
  );

  const speakWithCallback = useCallback(
    (text: string, callback: () => void) => {
      if (!synthRef.current || !state.isSupported) {
        callback();
        return;
      }

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      if (state.selectedVoice) {
        utterance.voice = state.selectedVoice;
      }

      utterance.rate = state.rate;
      utterance.pitch = state.pitch;
      utterance.lang = language;

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        callback();
      };

      utterance.onerror = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        callback();
      };

      synthRef.current.speak(utterance);
    },
    [state.isSupported, state.selectedVoice, state.rate, state.pitch, language]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false, isPaused: false }));
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && state.isSpeaking && !state.isPaused) {
      synthRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, [state.isSpeaking, state.isPaused]);

  const resume = useCallback(() => {
    if (synthRef.current && state.isPaused) {
      synthRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, [state.isPaused]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setState(prev => ({ ...prev, selectedVoice: voice }));
  }, []);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate: Math.max(0.5, Math.min(2, rate)) }));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setState(prev => ({ ...prev, pitch: Math.max(0.5, Math.min(2, pitch)) }));
  }, []);

  const actions = useRef({
    speak,
    speakWithCallback,
    stop,
    pause,
    resume,
    setVoice,
    setRate,
    setPitch,
  });

  // Update actions ref when dependencies change
  useEffect(() => {
    actions.current = {
      speak,
      speakWithCallback,
      stop,
      pause,
      resume,
      setVoice,
      setRate,
      setPitch,
    };
  }, [speak, speakWithCallback, stop, pause, resume, setVoice, setRate, setPitch]);

  return [state, actions.current];
}

export default useSpeechSynthesis;
