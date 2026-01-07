'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Bell, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserPreferences, getUserPreferences } from '@/actions/user';
import { useToast } from '@/hooks/use-toast';
import { JOB_ROLES, ExperienceLevel } from '@/types';

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'executive', label: 'Executive (10+ years)' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    preferredLanguage: 'en' as const,
    targetRole: '',
    experienceLevel: null as ExperienceLevel | null,
    timezone: 'Asia/Dhaka',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const result = await getUserPreferences();
      if (result.success && result.data) {
        setPreferences({
          preferredLanguage: 'en',
          targetRole: result.data.targetRole,
          experienceLevel: result.data.experienceLevel ?? null,
          timezone: result.data.timezone,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const result = await updateUserPreferences(preferences);

      if (result.success) {
        toast({
          title: 'Settings Saved',
          description: 'Your preferences have been updated',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InterPrep AI</span>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account settings</p>
        </div>

        {/* Interview Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Interview Preferences
            </CardTitle>
            <CardDescription>Customize your interview practice experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Select
                  value={preferences.targetRole}
                  onValueChange={value => setPreferences({ ...preferences, targetRole: value })}
                >
                  <SelectTrigger id="targetRole" className="mt-2">
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_ROLES.map(role => (
                      <SelectItem key={role} value={role.toLowerCase().replace(/ /g, '-')}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={preferences.experienceLevel || ''}
                  onValueChange={value =>
                    setPreferences({ ...preferences, experienceLevel: value as ExperienceLevel })
                  }
                >
                  <SelectTrigger id="experienceLevel" className="mt-2">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and tips via email
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Practice Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to practice regularly
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </main>
    </div>
  );
}
