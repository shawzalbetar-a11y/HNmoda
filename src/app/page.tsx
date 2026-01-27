'use client';
import { Hero } from '@/components/sections/hero';
import { WhatWeDo } from '@/components/sections/what-we-do';
import { OurWork } from '@/components/sections/our-work';
import { ContactUs } from '@/components/sections/contact-us';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div>
      <Hero />
      <AnimateOnScroll>
        <WhatWeDo />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <OurWork />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ContactUs />
      </AnimateOnScroll>
    </div>
  );
}
