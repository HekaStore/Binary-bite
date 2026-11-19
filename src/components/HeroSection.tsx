'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Star,
  Award,
} from 'lucide-react';
import { BRAND_INFO, OFFICIAL_PRODUCTS } from '@/data/products';
import { calculateNextOrderAllocation } from '@/utils/dailyQuota';

export const HeroSection: React.FC = () => {
  const [activeQuota, setActiveQuota] = useState<{
    count: number;
    dayIndex: number;
  }>({
    count: 0,
    dayIndex: 1,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('binary_bite_orders');
      if (raw) {
        const orders = JSON.parse(raw);
        const alloc = calculateNextOrderAllocation(orders);
        setActiveQuota({
          count: alloc.currentDayOrdersCount,
          dayIndex: alloc.scheduledDayIndex,
        });
      }
    } catch {}
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="beranda"
      data-enter="true"
      className="relative bg-[#0284C7] text-white overflow-hidden min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8 sm:py-12"
    >
      {/* Background Graphic Elements: Aerodynamic Origami Sky */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl" />

        {/* Paper Plane Dashed Flight Loop Path */}
        <svg
          className="absolute top-10 right-20 w-[600px] h-[400px] hidden lg:block opacity-60"
          viewBox="0 0 600 400"
          fill="none"
        >
          <path
            d="M 50 320 C 120 200, 280 120, 360 220 C 420 300, 480 180, 520 80"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Origami Paper Plane Accent */}
        <div className="absolute top-6 sm:top-10 right-6 sm:right-16 w-24 sm:w-36 lg:w-48 opacity-30 sm:opacity-85 pointer-events-none select-none">
          <svg viewBox="0 0 240 180" fill="none" className="w-full drop-shadow-xl">
            <polygon points="20,130 220,30 140,160" fill="#FFFFFF" />
            <polygon points="140,160 220,30 110,130" fill="#E0F2FE" />
            <polygon points="20,130 110,130 220,30" fill="#BAE6FD" />
            <polygon points="110,130 140,160 125,175" fill="#7DD3FC" />
          </svg>
        </div>

        {/* Mountain Baseline Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg viewBox="0 0 1440 240" fill="none" className="w-full h-full">
            <polygon points="0,240 180,120 360,240" fill="#FFFFFF" />
            <polygon points="360,240 520,80 720,240" fill="#F0F9FF" />
            <polygon points="680,240 860,60 1080,240" fill="#FFFFFF" />
            <polygon points="1020,240 1200,100 1440,240" fill="#BAE6FD" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        {/* Main 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
          {/* Left Column: Authentic Copy & Primary Actions */}
          <div className="lg:col-span-7">
            {/* Event & Target Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] sm:text-xs font-mono font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>STAND KELAS 12B • 27 NOVEMBER 2026</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/25 rounded-full text-white text-[10px] sm:text-xs font-mono font-bold shadow-sm">
                <span>🎯 Kuota: 25 Pesanan/Hari ({activeQuota.count}/25)</span>
              </div>
            </div>

            {/* Main Brand Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase font-mono">
              BINARY<span className="text-sky-200">.BITE</span>
            </h1>

            <div className="text-xl sm:text-3xl text-sky-100 font-bold my-2 tracking-wide font-sans">
              One Bite, Endless Happiness!
            </div>

            {/* Factual Value Proposition */}
            <p className="text-xs sm:text-base text-white/95 font-medium max-w-xl leading-relaxed mt-2 mb-6">
              Festival kuliner resmi dari <strong>Kelas 12B</strong> di <strong>{BRAND_INFO.standLocation}</strong>. Menyajikan 5 menu pilihan istimewa dengan harga hemat bersahabat <strong>Rp3.000 s/d Rp9.000</strong>.
            </p>

            {/* Action Buttons & Fast Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-sky-50 text-[#0284C7] font-black text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                <span>Pesan Menu Lezat</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#cara-pemesanan"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-full border border-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
              >
                <span>Alur Pemesanan</span>
              </a>
            </div>

            {/* Quick Stand Spec Bar (Street & District only - Rule 9) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 max-w-xl text-left">
              <div className="p-1.5">
                <span className="text-[9px] font-bold text-sky-200 block uppercase font-mono">Lokasi</span>
                <span className="text-xs font-bold text-white truncate block">Jl. AR Hakim, Ditotrunan</span>
              </div>
              <div className="p-1.5">
                <span className="text-[9px] font-bold text-sky-200 block uppercase font-mono">Hari & Tanggal</span>
                <span className="text-xs font-bold text-white block">Jumat, 27 Nov</span>
              </div>
              <div className="p-1.5">
                <span className="text-[9px] font-bold text-sky-200 block uppercase font-mono">Buka Stand</span>
                <span className="text-xs font-bold text-white block">07:00 WIB</span>
              </div>
              <div className="p-1.5">
                <span className="text-[9px] font-bold text-sky-200 block uppercase font-mono">Pengambilan</span>
                <span className="text-xs font-bold text-white block">Lumajang Kota</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Visual Collage of Real Products */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-white/90 text-slate-800 relative">
              {/* Origami Dog-Ear Corner */}
              <div className="absolute top-0 right-0 bg-[#0284C7] text-white px-3 py-1 rounded-bl-2xl text-[10px] font-mono font-bold tracking-wider">
                MENU BEST SELLER
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  5 Menu Kuliner Khas 12B
                </h3>
              </div>

              {/* 3 Featured Products Mini Showcase */}
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {OFFICIAL_PRODUCTS.slice(1, 4).map((p) => (
                  <div
                    key={p.id}
                    className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-sky-300 transition-all hover:-translate-y-0.5"
                  >
                    <div className="aspect-square overflow-hidden bg-sky-100">
                      <img
                        src={p.image}
                        alt={p.alt}
                        className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
                        loading="eager"
                      />
                    </div>
                    <div className="p-1.5 text-center">
                      <div className="text-[11px] font-extrabold text-slate-800 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-[#0284C7]">
                        Rp{p.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">Rating 4.9 • Rasa Terjamin</span>
                </div>
                <button
                  onClick={scrollToCatalog}
                  className="font-bold text-[#0284C7] hover:underline text-[11px] flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges (Rule 5: hover lifts 2px, Rule 4: equal edges) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Send className="w-5 h-5 transform -rotate-45" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">Harga Pelajar</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Mulai Rp3.000 s/d Rp9.000</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">100% Higienis</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Olahan segar siswa 12B</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">Layanan Cepat</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Konfirmasi via WA Admin</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">Target 25 / Hari</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Fresh order rollover</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
