import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Navbar } from '@/components/layout/Navbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dashboard" />

      {/* Main Content */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
