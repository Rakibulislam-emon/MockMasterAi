'use client';

import Link from 'next/link';
import { Mic, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Integration', href: '/integration' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Interview Tips', href: '/tips' },
    { label: 'Community', href: '/community' },
    { label: 'Help Center', href: '/help' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'Partners', href: '/partners' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Licenses', href: '/licenses' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background pb-12 pt-24">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-6 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
           
            <p className="mb-6 max-w-sm text-muted-foreground">
              Master your interview skills with the most advanced AI-powered practice platform. Get
              hired faster and with more confidence.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(social => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-white/10 hover:text-primary"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="mb-4 font-semibold text-foreground">{category}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
     
      </div>
    </footer>
  );
}
