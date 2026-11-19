'use client';

import React from 'react';
import { ArrowDown, Sparkles, ShoppingBag, ShieldCheck, Star, Award } from 'lucide-react';
import { BRAND_INFO, OFFICIAL_PRODUCTS } from '@/data/products';
import { formatRupiah } from '@/utils/formatters';

export const HeroSection: React.FC = () => {
  const scrollToKatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCara = () => {
    const el = document.getElementById('cara-pemesanan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="beranda" className="relative overflow-hidden bg-brand-white pt-10 sm:pt-16 pb-12">
      {/* Subtle Binary Grid Pattern (CSS SVG without gradient) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#0A2463 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Running Marquee Ticker */}
      <div className="w-full bg-brand-cobalt text-brand-white py-2.5 overflow-hidden border-y-2 border-brand-royal mb-10">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-6 px-4">
            <span>BINARY.BITE</span>
            <span>•</span>
            <span className="text-brand-sky">ONE BITE, ENDLESS HAPPINESS!</span>
            <span>•</span>
            <span>JUMAT, 27 NOVEMBER 2026</span>
            <span>•</span>
            <span className="text-brand-sky">STAND KELAS 12B</span>
            <span>•</span>
            <span>PRE-ORDER SEKARANG</span>
            <span>•</span>
            <span>DIJAMIN ENAK & SEGAR</span>
            <span>•</span>
            <span>BINARY.BITE</span>
            <span>•</span>
            <span className="text-brand-sky">ONE BITE, ENDLESS HAPPINESS!</span>
            <span>•</span>
            <span>JUMAT, 27 NOVEMBER 2026</span>
            <span>•</span>
            <span className="text-brand-sky">STAND KELAS 12B</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Event Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-sky border-2 border-brand-royal rounded-xl text-brand-cobalt text-xs font-mono font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-electric animate-ping" />
              <span>SPECIAL EVENT • JUMAT, 27 NOVEMBER 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-cobalt leading-[1.08] mb-4">
              BINARY<span className="text-brand-electric">.BITE</span>
            </h1>

            {/* Tagline */}
            <div className="inline-block bg-brand-royal text-brand-white px-3 py-1 font-mono font-bold text-sm sm:text-base rounded-md mb-6 tracking-wide">
              “{BRAND_INFO.tagline}”
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-brand-slate font-medium max-w-2xl leading-relaxed mb-8">
              Festival kuliner spesial persembahan dari <strong>Kelas 12B</strong>. 
              Menyajikan perpaduan 5 menu camilan manis, roti abon gurih, es gabin dingin, dan es cappucino cincau segar dengan presisi rasa maksimal dan harga bersahabat!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={scrollToKatalog}
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-cobalt text-brand-white text-base font-bold rounded-xl border-2 border-brand-cobalt shadow-solid-electric hover:bg-brand-royal hover:border-brand-royal active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Pesan Sekarang
              </button>
              <button
                onClick={scrollToCara}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-white text-brand-cobalt text-base font-bold rounded-xl border-2 border-brand-royal hover:bg-brand-sky active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Cara Pemesanan</span>
                <ArrowDown className="w-4 h-4 text-brand-royal" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t-2 border-brand-line w-full max-w-lg">
              <div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-brand-cobalt">100%</div>
                <div className="text-xs font-semibold text-brand-muted">Bahan Segar</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-brand-cobalt">Rp3K-9K</div>
                <div className="text-xs font-semibold text-brand-muted">Harga Pelajar</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-brand-cobalt">Stand 12B</div>
                <div className="text-xs font-semibold text-brand-muted">Siap Antar Area</div>
              </div>
            </div>
          </div>

          {/* Right Column: Bento Showcase Cards */}
          <div className="lg:col-span-5 relative">
            <div className="bg-brand-sky border-2 border-brand-cobalt rounded-2xl p-5 shadow-solid-cobalt">
              {/* Stand Banner Card */}
              <div className="bg-brand-white border-2 border-brand-royal rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-line">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-cobalt" />
                    <span className="font-mono text-xs font-bold text-brand-cobalt uppercase">
                      STAND BINARY BITE — XII B
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-brand-sky text-brand-cobalt rounded border border-brand-royal">
                    OFFICIAL
                  </span>
                </div>
                
                {/* Image showcase */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-brand-royal bg-brand-slate">
                  <img
                    src="/images/stand-menu.jpg"
                    alt="Menu Resmi Stand Binary Bite XII B"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-brand-cobalt text-brand-white p-2 rounded text-[11px] font-mono flex items-center justify-between">
                    <span>Scan & Order Langsung</span>
                    <span className="text-brand-sky font-bold">5 Menu Favorit</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid Highlights */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Es Gabin */}
                <div className="bg-brand-white border-2 border-brand-royal rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-brand-electric">
                      [04] BEST SELLER
                    </span>
                    <Star className="w-3.5 h-3.5 text-brand-royal fill-brand-royal" />
                  </div>
                  <div className="my-2 text-center">
                    <img
                      src="/images/products/es-gabin.svg"
                      alt="Es Gabin"
                      className="w-20 h-16 mx-auto object-contain"
                    />
                    <div className="font-bold text-sm text-brand-cobalt mt-1">Es Gabin Ice Cream</div>
                    <div className="font-mono text-xs font-extrabold text-brand-electric">Rp9.000</div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-muted text-center">Varian Milo / Cokelat</span>
                </div>

                {/* Card 2: Es Capcin */}
                <div className="bg-brand-white border-2 border-brand-royal rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-brand-electric">
                      [05] FRESH DRINK
                    </span>
                    <Award className="w-3.5 h-3.5 text-brand-royal" />
                  </div>
                  <div className="my-2 text-center">
                    <img
                      src="/images/products/es-capcin.svg"
                      alt="Es Capcin"
                      className="w-20 h-16 mx-auto object-contain"
                    />
                    <div className="font-bold text-sm text-brand-cobalt mt-1">Es Capcin Creamy</div>
                    <div className="font-mono text-xs font-extrabold text-brand-electric">Rp6.000</div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-muted text-center">Cincau Kenyal Dingin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

