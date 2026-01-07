'use client';

import { useState, useCallback, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Send,
  VolumeX,
  Loader2,
  MessageSquare,
  Sparkles,
  StopCircle,
  ArrowLeft,
  Brain,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useToast } from '@/hooks/use-toast';
import {
  sendInterviewMessage,
  completeInterviewSession,
  getInterviewSession,
} from '@/actions/interview';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export default function InterviewRoomPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sessionId } = use(params);

  // Load session data
  useEffect(() => {
    const loadSession = async () => {
      try {
        const result = await getInterviewSession(sessionId);
        if (result.success && result.data) {
          const formattedMessages = result.data.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(formattedMessages);
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to load session',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading session:', error);
        toast({
          title: 'Error',
          description: 'Failed to load session',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [sessionId, toast]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Speech recognition
  const [speechState, speechActions] = useSpeechRecognition({
    language: 'en-US',
    onResult: transcript => {
      setInput(transcript);
    },
    onError: error => {
      toast({
        title: 'Speech Error',
        description: `Could not recognize speech: ${error}`,
        variant: 'destructive',
      });
    },
  });

  // Text to speech
  const [, ttsActions] = useSpeechSynthesis({
    onStart: () => setIsSpeaking(true),
    onEnd: () => setIsSpeaking(false),
    onError: () => setIsSpeaking(false),
  });

  // Auto-speak the last AI message when messages load initially
  const [hasSpokenInitial, setHasSpokenInitial] = useState(false);

  useEffect(() => {
    if (!isLoading && messages.length > 0 && !hasSpokenInitial) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'ai') {
        const timer = setTimeout(() => {
          ttsActions.speak(lastMessage.content);
          setHasSpokenInitial(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, messages, ttsActions, hasSpokenInitial]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const result = await sendInterviewMessage(sessionId, userMessage.content);

      if (result.success) {
        const aiMessage: Message = {
          role: 'ai',
          content: result.data!.response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        ttsActions.speak(aiMessage.content);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, sessionId, ttsActions, toast]);

  const handleEndInterview = useCallback(async () => {
    setIsEnding(true);
    ttsActions.stop();

    try {
      const result = await completeInterviewSession(sessionId);

      if (result.success) {
        toast({
          title: 'Interview Complete',
          description: 'Your feedback is ready!',
        });
        router.push(`/feedback/${sessionId}`);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to complete interview',
          variant: 'destructive',
        });
        setIsEnding(false);
      }
    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsEnding(false);
    }
  }, [sessionId, router, toast, ttsActions]);

  const handleVoiceInput = () => {
    if (speechState.isListening) {
      speechActions.stopListening();
    } else {
      speechActions.startListening();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      ttsActions.stop();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-background/60 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-white/5"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold sm:text-base">Interview in Progress</h1>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-muted-foreground">Live Session</p>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="bg-red-500/10 text-red-500 shadow-none hover:bg-red-500/20 hover:text-red-400"
          onClick={handleEndInterview}
          disabled={isEnding || isProcessing}
        >
          {isEnding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ending...
            </>
          ) : (
            <>
              <StopCircle className="mr-2 h-4 w-4" />
              End Interview
            </>
          )}
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" id="chat-container">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 ? (
              <div className="flex h-[50vh] flex-col items-center justify-center text-center text-muted-foreground">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 ring-1 ring-indigo-500/20">
                    <Brain className="h-12 w-12 text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium text-foreground">Ready to begin?</h3>
                  <p className="text-sm opacity-80">
                    Your AI interviewer is preparing the first question.
                  </p>
                </motion.div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-6 py-4 shadow-sm md:max-w-[75%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                          : message.role === 'system'
                            ? 'w-full bg-muted/50 text-center text-sm text-muted-foreground shadow-none'
                            : 'bg-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] text-foreground ring-1 ring-white/10'
                      }`}
                    >
                      {message.role !== 'system' && (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      )}
                      {message.role === 'system' && <p>{message.content}</p>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isProcessing && !isEnding && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="flex gap-1">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-400/50"
                    style={{ animationDelay: '0s' }}
                  ></span>
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-400/50"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-400/50"
                    style={{ animationDelay: '0.4s' }}
                  ></span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sidebar - AI Visualizer (Desktop) */}
        <div className="hidden w-80 border-l border-white/10 bg-background/40 backdrop-blur-sm lg:block">
          <div className="flex h-full flex-col p-6">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              Audio Visualizer
            </h3>

            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-8 shadow-inner">
              <div className="flex h-32 items-center gap-1.5">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1.5 rounded-full ${isSpeaking ? 'bg-indigo-400' : 'bg-indigo-400/20'}`}
                    animate={
                      isSpeaking
                        ? {
                            height: [16, Math.max(16, Math.random() * 96), 16],
                          }
                        : {
                            height: 16,
                          }
                    }
                    transition={{
                      duration: 0.4,
                      repeat: isSpeaking ? Infinity : 0,
                      repeatType: 'reverse',
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <p
                  className={`text-sm font-medium transition-colors ${isSpeaking ? 'text-indigo-400' : 'text-muted-foreground'}`}
                >
                  {isSpeaking
                    ? 'AI is speaking...'
                    : isProcessing
                      ? 'Processing response...'
                      : 'Waiting for input'}
                </p>
                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 h-8 border-indigo-500/20 bg-indigo-500/10 text-xs text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
                    onClick={toggleSpeech}
                  >
                    <VolumeX className="mr-2 h-3 w-3" />
                    Mute Audio
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Speaking Tips</p>
                <ul className="space-y-2 text-xs text-muted-foreground/80">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Use the mic button to toggle input</li>
                  <li>• Press Enter to send text messages</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-background/60 p-4 backdrop-blur-xl sm:p-6">
        <div className="mx-auto max-w-3xl">
          {/* Voice Indicator */}
          <AnimatePresence>
            {speechState.isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4 flex items-center justify-center gap-2"
              >
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
                <span className="text-sm font-medium text-red-400">Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Controls */}
          <div className="relative flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant={speechState.isListening ? 'destructive' : 'outline'}
                className={`h-[52px] w-[52px] rounded-2xl border-white/10 shadow-lg transition-all ${
                  speechState.isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={handleVoiceInput}
                disabled={!speechState.isSupported}
              >
                {speechState.isListening ? (
                  <Mic className="h-6 w-6 animate-pulse" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </motion.div>

            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your answer or speak..."
                className="min-h-[52px] w-full resize-none rounded-2xl border-white/10 bg-white/5 py-[14px] pl-4 pr-14 text-base shadow-inner focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50"
                rows={1}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isProcessing}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="absolute bottom-1.5 right-1.5 h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-3 hidden text-center text-xs text-muted-foreground/60 sm:block">
            Press <kbd className="rounded bg-white/10 px-1 py-0.5 font-sans">Enter</kbd> to send,{' '}
            <kbd className="rounded bg-white/10 px-1 py-0.5 font-sans">Shift + Enter</kbd> for new
            line
          </p>
        </div>
      </div>
    </div>
  );
}
