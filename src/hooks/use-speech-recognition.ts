'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  interimTranscript: string;
}

interface SpeechRecognitionActions {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  abort: () => void;
}

// Interfaces for Web Speech API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

/**
 * Custom hook for Web Speech API (Speech Recognition)
 * Provides voice input capabilities for interview responses
 */
export function useSpeechRecognition(options: {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, confidence: number) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onStart?: () => void;
}): [SpeechRecognitionState, SpeechRecognitionActions] {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onEnd,
    onError,
    onStart,
  } = options;

  // Use refs to keep callbacks stable and avoid re-triggering effects
  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);

  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
    onStartRef.current = onStart;
  }, [onResult, onEnd, onError, onStart]);

  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    confidence: 0,
    error: null,
    interimTranscript: '',
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;

    setState(prev => ({ ...prev, isSupported }));

    if (isSupported && SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        setState(prev => ({
          ...prev,
          isListening: true,
          error: null,
        }));
        onStartRef.current?.();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const conf = result[0].confidence;

          if (result.isFinal) {
            finalTranscript += transcript;
            if (conf > confidence) {
              confidence = conf;
            }
          } else {
            interimTranscript += transcript;
          }
        }

        setState(prev => ({
          ...prev,
          transcript: prev.transcript + finalTranscript,
          interimTranscript,
          confidence,
        }));

        if (finalTranscript) {
          onResultRef.current?.(finalTranscript, confidence);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errorMessage = event.error;
        setState(prev => ({
          ...prev,
          isListening: false,
          error: errorMessage,
        }));
        onErrorRef.current?.(errorMessage);
      };

      recognition.onend = () => {
        setState(prev => ({
          ...prev,
          isListening: false,
          interimTranscript: '',
        }));
        onEndRef.current?.();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, continuous, interimResults]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition && !state.isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition && state.isListening) {
      recognition.stop();
    }
  }, [state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      confidence: 0,
    }));
  }, []);

  const abort = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.abort();
    }
  }, []);

  return [
    state,
    {
      startListening,
      stopListening,
      resetTranscript,
      abort,
    },
  ];
}

// Type declaration for Web Speech API
// Using 'any' since SpeechRecognition is an experimental browser API not in standard TypeScript types
declare global {
  interface Window {
    SpeechRecognition: {
      new (): ISpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): ISpeechRecognition;
    };
  }
}

export default useSpeechRecognition;
