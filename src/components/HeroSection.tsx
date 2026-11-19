'use client';

import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Utensils,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Truck,
  ArrowRight
} from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Makanan' | 'Minuman'>('Semua');

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="beranda" className="relative bg-[#0284C7] overflow-hidden pt-8 pb-20">
      {/* Background Graphic Elements: Sky, Origami Paper Plane & Polygonal Mountain Silhouettes */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Soft Background Sky Texture & Sun Flare */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl" />

        {/* Paper Plane Dashed Flight Loop Path */}
        <svg
          className="absolute top-10 right-20 w-[600px] h-[400px] hidden md:block opacity-70"
          viewBox="0 0 600 400"
          fill="none"
        >
          <path
            d="M 50 320 C 120 200, 280 120, 360 220 C 420 300, 480 180, 520 80"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="8 8"
            className="animate-flight-path"
          />
        </svg>

        {/* Origami 2D Paper Plane Illustration */}
        <div className="absolute top-12 right-12 lg:right-28 w-44 lg:w-64 animate-pulse">
          <svg viewBox="0 0 240 180" fill="none" className="w-full drop-shadow-2xl">
            {/* Origami Paper Plane Facets */}
            <polygon points="20,130 220,30 140,160" fill="#FFFFFF" />
            <polygon points="140,160 220,30 110,130" fill="#E0F2FE" />
            <polygon points="20,130 110,130 220,30" fill="#BAE6FD" />
            <polygon points="110,130 140,160 125,175" fill="#7DD3FC" />
          </svg>
        </div>

        {/* Low-Poly White Mountain / Cloud Shapes at the Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-44 opacity-25">
          <svg viewBox="0 0 1440 240" fill="none" className="w-full h-full preserve-3d">
            <polygon points="0,240 180,120 360,240" fill="#FFFFFF" />
            <polygon points="360,240 520,80 720,240" fill="#F0F9FF" />
            <polygon points="680,240 860,60 1080,240" fill="#FFFFFF" />
            <polygon points="1020,240 1200,100 1440,240" fill="#BAE6FD" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Headline Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-white text-xs font-mono font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>SPECIAL EVENT • JUMAT, 27 NOVEMBER 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight uppercase font-mono">
            BINARY<span className="text-sky-200">.BITE</span>
          </h1>

          <div className="font-script text-3xl sm:text-5xl text-sky-100 font-bold my-2 tracking-wide transform -rotate-1">
            One Bite, Endless Happiness.
          </div>

          <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl leading-relaxed mt-2 mb-6">
            Festival kuliner modern persembahan dari <strong>Kelas 12B</strong>. Nikmati 5 pilihan camilan renyah, kue lembut lumer, dan minuman kopi cincau segar dengan harga hemat bersahabat!
          </p>

          <button
            onClick={scrollToCatalog}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0284C7] font-extrabold text-sm rounded-full shadow-btn-sky hover:bg-sky-50 active:scale-95 transition-all"
          >
            <span>Jelajahi Menu Lezat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Quick Search / Order Bar (Modelled directly on the Flights/Hotels bar in reference) */}
        <div className="bg-white rounded-3xl sm:rounded-4xl shadow-soft-float p-3 sm:p-5 border border-sky-100 mb-14">
          {/* Top Category Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4 px-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('Semua')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'Semua'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0284C7] hover:bg-sky-50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Semua Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('Makanan')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'Makanan'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0284C7] hover:bg-sky-50'
              }`}
            >
              <span>🍩 Makanan (4)</span>
            </button>

            <button
              onClick={() => setActiveTab('Minuman')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'Minuman'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0284C7] hover:bg-sky-50'
              }`}
            >
              <span>🥤 Minuman Dingin (1)</span>
            </button>
          </div>

          {/* Segmented Inputs Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center px-2">
            {/* Box 1: Location */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Lokasi Stand
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="truncate">Stand 12B • Lapangan</span>
              </div>
            </div>

            {/* Box 2: Tanggal */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Tanggal Acara
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="truncate">Jumat, 27 Nov 2026</span>
              </div>
            </div>

            {/* Box 3: Jam Buka */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Waktu Pelayanan
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="truncate">07:00 - Selesai WIB</span>
              </div>
            </div>

            {/* Box 4: Layanan Antar */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Metode Pengambilan
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                <Truck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="truncate">Stand / Antar Kelas</span>
              </div>
            </div>

            {/* Box 5: Big Search Button */}
            <button
              onClick={scrollToCatalog}
              className="w-full h-full py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-btn-sky transition-all active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Cari Menu</span>
            </button>
          </div>
        </div>

        {/* 4 Floating Feature Badges (Directly matching the 4 white cards in the reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-card-paper border border-sky-100 flex items-center gap-3.5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Send className="w-6 h-6 transform -rotate-45" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                Harga Pelajar
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Mulai Rp3.000 hingga Rp9.000
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-card-paper border border-sky-100 flex items-center gap-3.5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                100% Higienis
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Bahan segar olahan siswa 12B
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-card-paper border border-sky-100 flex items-center gap-3.5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                Layanan Cepat
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Admin Nisrina (0858-4378-8915)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-card-paper border border-sky-100 flex items-center gap-3.5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                Siap Antar Kelas
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Diantar tepat saat jam istirahat
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
