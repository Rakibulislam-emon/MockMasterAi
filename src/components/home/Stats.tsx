'use client';

import { useTranslations } from 'next-intl';

export function Stats() {
  const t = useTranslations('Stats');

  const stats = [
    { value: '10K+', label: t('interviews') },
    { value: '95%', label: t('satisfaction') },
    { value: '50+', label: t('roles') },
    { value: '24/7', label: t('availability') },
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
