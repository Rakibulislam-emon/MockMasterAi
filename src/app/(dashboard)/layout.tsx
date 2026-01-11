import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <Navbar variant="dashboard" />
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pb-24 pt-16 md:ml-64 md:pb-8">{children}</main>
      <MobileNav />
    </div>
  );
}
