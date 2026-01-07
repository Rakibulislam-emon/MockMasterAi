'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Send, VolumeX, Loader2, MessageSquare } from 'lucide-react';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { sessionId } = require('react').use(params);

  // Load session data
  require('react').useEffect(() => {
    const loadSession = async () => {
      try {
        const result = await getInterviewSession(sessionId);
        if (result.success && result.data) {
          // Convert string timestamps back to Date objects if needed,
          // though JSON.parse(JSON.stringify()) usually leaves them as strings.
          // We map them to ensure correct type.
          const formattedMessages = result.data.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(formattedMessages);

          // If the last message is from AI, speak it automatically to start conversation
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          if (lastMessage && lastMessage.role === 'ai') {
            // We can't immediately speak here because init might not be ready,
            // but we can try or set a flag.
            // Simplest is to just let user read it, or use a separate effect.
            // For "AI Initiation", simply showing the message is often enough,
            // but speaking it adds the "live" feel.
          }
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
  require('react').useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'ai') {
        // Small timeout to ensure audio context is ready/user interaction (browser policy might block)
        // Note: Chrome requires user interaction first.
        // We might need a "Start" button overlay if autoplay is blocked,
        // but let's try calling it.
        // ttsActions.speak(lastMessage.content);
        // Commented out for now to avoid auto-play policy issues until user interaction is confirmed.
        // For "AI Initiation", seeing the question is the primary goal.
      }
    }
  }, [isLoading, messages, ttsActions]);

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

        // Speak the AI response
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
    setIsProcessing(true);

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
      }
    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, router, toast]);

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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            Back
          </Button>
          <div>
            <h1 className="font-semibold">Interview in Progress</h1>
            <p className="text-sm text-muted-foreground">Practice Session</p>
          </div>
        </div>

        <Button variant="destructive" onClick={handleEndInterview} disabled={isProcessing}>
          End Interview
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
              <div>
                <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Your interview will begin shortly.</p>
                <p className="text-sm">The AI interviewer will ask you questions.</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.role === 'user' ? 'user' : message.role === 'ai' ? 'ai' : 'system'
                }`}
              >
                <p>{message.content}</p>
                <span className="mt-1 block text-xs opacity-50">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}

          {isProcessing && (
            <div className="chat-message ai">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - AI Visualizer */}
        <div className="hidden w-64 border-l p-4 lg:block">
          <Card className="flex h-full flex-col items-center justify-center p-6">
            <div className="audio-visualizer mb-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`audio-bar ${isSpeaking ? 'active' : ''}`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: isSpeaking ? `${20 + Math.random() * 80}%` : '20%',
                  }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {isSpeaking ? 'AI is speaking...' : 'Waiting for response'}
            </p>
            {isSpeaking && (
              <Button variant="outline" size="sm" className="mt-4" onClick={toggleSpeech}>
                <VolumeX className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </Card>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="mx-auto max-w-4xl">
          {/* Voice Indicator */}
          {speechState.isListening && (
            <div className="voice-indicator listening mx-auto mb-4 w-fit">
              <div className="voice-dot listening" />
              <span>Listening...</span>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-4">
            <Button
              size="icon"
              variant={speechState.isListening ? 'destructive' : 'outline'}
              className="shrink-0"
              onClick={handleVoiceInput}
              disabled={!speechState.isSupported}
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your answer or speak..."
              className="max-h-[120px] min-h-[60px]"
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
              className="shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
