'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Award, BarChart2, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getInterviewSession } from '@/actions/interview';
import type { IInterviewSession, IFeedback } from '@/lib/models/InterviewSession';

export default function FeedbackPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [session, setSession] = useState<IInterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrap params using React.use
  const { sessionId } = use(params);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await getInterviewSession(sessionId);
        if (result.success && result.data) {
          setSession(result.data);
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to load feedback',
            variant: 'destructive',
          });
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: 'Error',
          description: 'Failed to load feedback',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Analyzing your interview performance...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.feedback) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle /> Feedback Not Available
            </CardTitle>
            <CardDescription>
              We couldn't find the feedback for this session. It might not be completed yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { feedback } = session;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Interview Completed</span>
            </div>
            <h1 className="text-3xl font-bold">Interview Feedback</h1>
            <p className="text-muted-foreground">
              Session for {session.targetRole} • {new Date(session.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">{feedback.overallScore}</span>
                <span className="text-muted-foreground">/ 100</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{session.messages.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {session.duration ? Math.round(session.duration / 60) : 0}m
                </span>
                <span className="text-sm text-muted-foreground">
                  {session.duration ? session.duration % 60 : 0}s
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                Completed
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Feedback Content */}
          <div className="space-y-6 md:col-span-2">
            {/* Detailed Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Quality</span>
                    <span className="font-medium">{feedback.contentScore}/100</span>
                  </div>
                  <Progress value={feedback.contentScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Communication Style</span>
                    <span className="font-medium">{feedback.confidenceScore}/100</span>
                  </div>
                  <Progress value={feedback.confidenceScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Language Proficiency</span>
                    <span className="font-medium">{feedback.languageScore}/100</span>
                  </div>
                  <Progress value={feedback.languageScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {feedback.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 rounded-lg border p-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.improvements.map((item: any, index: number) => (
                  <div key={index} className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-2 font-semibold text-primary">{item.category}</h4>
                    <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>

                    <div className="rounded border bg-background p-3 text-sm">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        SUGGESTED RESPONSE:
                      </p>
                      <p className="italic">"{item.suggestedResponse}"</p>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">Why:</span> {item.explanation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Recommended Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.suggestedResources.map((resource: any, index: number) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                      >
                        <p className="mb-1 text-sm font-medium text-primary">{resource.title}</p>
                        <Badge variant="secondary" className="max-w-fit text-xs uppercase">
                          {resource.type}
                        </Badge>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Ready for another?</CardTitle>
                <CardDescription className="text-primary-foreground/90">
                  Keep practicing to improve your score!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push('/practice')}
                >
                  Start New Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
