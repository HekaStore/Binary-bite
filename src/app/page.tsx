import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { CountdownSection } from '@/components/CountdownSection';
import { ProductCatalog } from '@/components/ProductCatalog';
import { OrderGuide } from '@/components/OrderGuide';
import { AboutSection } from '@/components/AboutSection';
import { FaqSection } from '@/components/FaqSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <ProductCatalog />
      <OrderGuide />
      <AboutSection />
      <FaqSection />
    </>
  );
}

