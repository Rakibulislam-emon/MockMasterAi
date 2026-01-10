import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import type { ResumeAnalysis } from '@/types';

interface ResumeScoreDashboardProps {
  analysis: ResumeAnalysis;
}

export function ResumeScoreDashboard({ analysis }: ResumeScoreDashboardProps) {
  const { overallScore, atsScore, sectionScores } = analysis;

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
      {sectionScores && (
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
