import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { LogoMarquee } from '@/components/home/LogoMarquee';
import { BentoGridFeatures } from '@/components/home/BentoGridFeatures';
import { InteractiveFlow } from '@/components/home/InteractiveFlow';
import { PremiumCTA } from '@/components/home/PremiumCTA';

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar variant="landing" />

      <main className="overflow-hidden">
        <Hero />
        <LogoMarquee />
        <BentoGridFeatures />
        <InteractiveFlow />
        <PremiumCTA />
      </main>

      <Footer />
    </div>
  );
}
