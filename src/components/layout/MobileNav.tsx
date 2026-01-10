'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, FileText, History, Trophy, Settings, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Mic },
  { name: 'Practice', href: '/practice', icon: Play },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'History', href: '/history', icon: History },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/80 backdrop-blur-xl md:hidden">
      <div className="flex justify-around py-3">
        {navigation.map(item => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-2 py-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
