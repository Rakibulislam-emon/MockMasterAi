'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Mic } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Common');

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InterPrep AI</span>
          </div>

          <p className="text-sm text-muted-foreground">{t('allRightsReserved')}</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              {t('termsOfService')}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
