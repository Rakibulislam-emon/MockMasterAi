'use client';

export function Stats() {
  const stats = [
    { value: '10K+', label: 'Interviews Practiced' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '50+', label: 'Job Roles Supported' },
    { value: '24/7', label: 'AI Availability' },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
