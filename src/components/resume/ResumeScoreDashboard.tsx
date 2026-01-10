import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Zap,
  Feather,
  Type,
  CheckSquare,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import type { ResumeAnalysis } from '@/types';

interface ResumeScoreDashboardProps {
  analysis: ResumeAnalysis;
  extractedText?: string;
}

export function ResumeScoreDashboard({ analysis, extractedText }: ResumeScoreDashboardProps) {
  const { overallScore, atsScore, sectionScores } = analysis;
  const [viewMode, setViewMode] = useState<'analysis' | 'raw'>('analysis');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant={viewMode === 'analysis' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('analysis')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Analysis
        </Button>
        <Button
          variant={viewMode === 'raw' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('raw')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Parsing View
        </Button>
      </div>

      {viewMode === 'raw' ? (
        <Card>
          <CardHeader>
            <CardTitle>Parsed Raw Content</CardTitle>
            <p className="text-sm text-muted-foreground">
              This is exactly what the ATS (Applicant Tracking System) reads. Check for garbled text
              or missing sections.
            </p>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-xs leading-relaxed text-foreground">
              {extractedText || 'No text content available.'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top Level Gauges */}
          <div className="grid gap-4 md:grid-cols-2">
            <ScoreCard
              title="Overall Score"
              score={overallScore || 0}
              description="Based on strict impact & formatting criteria"
              icon={TrendingUp}
            />
            <ScoreCard
              title="ATS Compatibility"
              score={atsScore || 0}
              description="Estimated parseability by applicant tracking systems"
              icon={CheckSquare}
            />
          </div>

          {/* Section Scores Grid */}
          {sectionScores ? (
            <div className="grid gap-4 md:grid-cols-4">
              <SectionScoreCard
                label="Impact"
                score={sectionScores.impact}
                icon={Zap}
                color="text-amber-500"
              />
              <SectionScoreCard
                label="Brevity"
                score={sectionScores.brevity}
                icon={Feather}
                color="text-blue-500"
              />
              <SectionScoreCard
                label="Style"
                score={sectionScores.style}
                icon={Type}
                color="text-purple-500"
              />
              <SectionScoreCard
                label="Skills"
                score={sectionScores.skills}
                icon={CheckCircle}
                color="text-emerald-500"
              />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <p>Detailed section analysis not available for this resume.</p>
              <p className="text-sm">Please re-upload to trigger the new AI engine.</p>
            </div>
          )}

          {/* Improvement Plan */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Detailed Improvement Plan</h3>
            <div className="grid gap-4">
              {(analysis.improvementSuggestions || []).map((suggestion, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">{suggestion.section}</CardTitle>
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium uppercase',
                          suggestion.importance === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : suggestion.importance === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        )}
                      >
                        {suggestion.importance} Priority
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{suggestion.suggestion}</p>

                      {/* Context Comparison */}
                      {suggestion.currentText && suggestion.replacementText && (
                        <div className="mt-4 rounded-lg bg-muted/50 p-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <span className="flex items-center gap-2 text-xs font-semibold text-red-500">
                                <XCircle className="h-3 w-3" /> PROBLEM
                              </span>
                              <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-200">
                                "{suggestion.currentText}"
                              </p>
                            </div>
                            <div className="space-y-2">
                              <span className="flex items-center gap-2 text-xs font-semibold text-green-500">
                                <CheckCircle className="h-3 w-3" /> FIX
                              </span>
                              <p className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-200">
                                "{suggestion.replacementText}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ScoreCard({ title, score, description, icon: Icon }: any) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform">
              <circle
                className="text-muted/20"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
              <circle
                className={cn(
                  'transition-all duration-1000 ease-out',
                  score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'
                )}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
            </svg>
            <span className="absolute text-2xl font-bold">{score}</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{getRatingLabel(score)}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionScoreCard({ label, score, icon: Icon, color }: any) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div
          className={cn(
            'mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background ring-1 ring-border',
            color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="mb-1 text-2xl font-bold">{score}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            className={cn(
              'h-full bg-primary',
              score < 60 && 'bg-red-500',
              score >= 60 && score < 80 && 'bg-yellow-500',
              score >= 80 && 'bg-green-500'
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function getRatingLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  return 'Needs Work';
}
