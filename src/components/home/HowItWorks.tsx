'use client';

export function HowItWorks() {
  const steps = [
    { step: '1', title: 'Create Account', desc: 'Sign up for free in seconds' },
    { step: '2', title: 'Upload Resume', desc: 'Let AI analyze your profile' },
    { step: '3', title: 'Practice', desc: 'Interview with our AI' },
    { step: '4', title: 'Improve', desc: 'Get feedback and track progress' },
  ];

  return (
    <section id="how-it-works" className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get started in just a few simple steps</p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map(item => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
