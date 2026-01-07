import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import {
  Trophy,
  Star,
  Target,
  Rocket,
  TrendingUp,
  Flame,
  Zap,
  Play,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUserAchievements, type Achievement } from '@/actions/achievements';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  play: Play,
  target: Target,
  rocket: Rocket,
  'trending-up': TrendingUp,
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
};

export default async function AchievementsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const result = await getUserAchievements();
  const achievements = result.data || [];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Achievements</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Summary Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Your Achievements
            </CardTitle>
            <CardDescription className="text-base">
              {unlockedCount === 0
                ? 'Start practicing to unlock your first achievement!'
                : `You've unlocked ${unlockedCount} of ${totalCount} achievements. Keep going!`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={(unlockedCount / totalCount) * 100} className="h-3 flex-1" />
              <span className="text-lg font-bold text-primary">
                {unlockedCount}/{totalCount}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </main>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = iconMap[achievement.icon] || Star;
  const progress =
    achievement.progress !== undefined && achievement.target
      ? Math.round((achievement.progress / achievement.target) * 100)
      : 0;

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        achievement.unlocked
          ? 'border-primary/50 bg-gradient-to-br from-primary/10 to-transparent'
          : 'opacity-75'
      }`}
    >
      {!achievement.unlocked && (
        <div className="absolute right-3 top-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
              achievement.unlocked
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3
              className={`mb-1 font-semibold ${
                achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {achievement.name}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">{achievement.description}</p>

            {!achievement.unlocked && achievement.target && (
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {achievement.progress} / {achievement.target}
                </p>
              </div>
            )}

            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-xs text-primary">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
