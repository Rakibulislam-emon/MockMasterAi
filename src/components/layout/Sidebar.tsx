'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, FileText, History, Trophy, Settings, LogOut, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Mic },
  { name: 'Practice', href: '/practice', icon: Play },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'History', href: '/history', icon: History },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-16 hidden w-64 border-r border-white/10 bg-background/60 backdrop-blur-xl md:block">
      <div className="flex h-full flex-col p-4">
        <nav className="flex-1 space-y-2">
          {navigation.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm hover:bg-primary/20'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <form action="/api/sign-out" method="POST">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:bg-white/5 hover:text-foreground"
              asChild
            >
              <Link href="/api/sign-out">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Link>
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
