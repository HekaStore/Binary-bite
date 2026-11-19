'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Utensils,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Star,
  Award,
  Flame,
  Snowflake,
} from 'lucide-react';
import { BRAND_INFO, OFFICIAL_PRODUCTS } from '@/data/products';
import { calculateNextOrderAllocation } from '@/utils/dailyQuota';
import { orderService } from '@/services/orderService';

export const HeroSection: React.FC = () => {
  const [activeQuota, setActiveQuota] = useState<{
    count: number;
    dayIndex: number;
  }>({
    count: 0,
    dayIndex: 1,
  });

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await orderService.getOrders();
      const alloc = calculateNextOrderAllocation(res.orders);
      setActiveQuota({
        count: alloc.currentDayOrdersCount,
        dayIndex: alloc.scheduledDayIndex,
      });
    };
    fetchQuota();
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="beranda"
      data-enter="true"
      className="relative bg-[#0284C7] text-white overflow-hidden min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between py-10 sm:py-14"
    >
      {/* Background Graphic Elements: Aerodynamic Origami Sky */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-sky-400/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-300/20 rounded-full blur-2xl" />

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
        <div className="absolute bottom-0 left-0 right-0 h-28 opacity-20">
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
          {/* Left Column: Authentic Food Store Copy & Actions */}
          <div className="lg:col-span-7">
            {/* Live Stand Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[11px] sm:text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>STAND KULINER KELAS 12B • 27 S/D 29 NOVEMBER 2026</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/25 rounded-full text-white text-[11px] sm:text-xs font-semibold shadow-sm">
                <Clock className="w-3.5 h-3.5 text-sky-200" />
                <span>Kapasitas Segar: 25 Porsi/Hari ({activeQuota.count}/25)</span>
              </div>
            </div>

            {/* Main Brand Title with Poppins */}
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight uppercase">
              BINARY<span className="text-sky-200">.BITE</span>
            </h1>

            {/* Appetizing Sub-Tagline */}
            <div className="font-heading font-extrabold text-xl sm:text-3xl text-sky-100 my-2 tracking-wide">
              One Bite, Endless Happiness!
            </div>

            {/* Factual Value Proposition */}
            <p className="text-sm sm:text-base text-white/95 font-medium max-w-xl leading-relaxed mt-2 mb-6">
              Sajian aneka kue lezat, kudapan renyah, dan minuman segar istimewa dari <strong>Kelas 12B</strong> di <strong>{BRAND_INFO.standLocation}</strong>. Dibuat fresh setiap hari dengan bahan berkualitas, harga bersahabat <strong>Rp3.000 s/d Rp9.000</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-sky-50 text-[#0284C7] font-heading font-black text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                <Utensils className="w-4 h-4 text-[#0284C7]" />
                <span>Pesan Menu Favorit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#cara-pemesanan"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm rounded-full border border-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
              >
                <span>Cara Pemesanan</span>
              </a>
            </div>

            {/* Quick Stand Spec Bar (Street & District only - Rule 9) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 max-w-xl text-left">
              <div className="p-1.5">
                <span className="text-[10px] font-bold text-sky-200 block uppercase">Lokasi Stand</span>
                <span className="text-xs font-bold text-white truncate block">Jl. AR Hakim, Ditotrunan</span>
              </div>
              <div className="p-1.5">
                <span className="text-[10px] font-bold text-sky-200 block uppercase">Hari & Tanggal</span>
                <span className="text-xs font-bold text-white block">27 s/d 29 Nov 2026</span>
              </div>
              <div className="p-1.5">
                <span className="text-[10px] font-bold text-sky-200 block uppercase">Buka Pukul</span>
                <span className="text-xs font-bold text-white block">07:00 WIB</span>
              </div>
              <div className="p-1.5">
                <span className="text-[10px] font-bold text-sky-200 block uppercase">Area Layanan</span>
                <span className="text-xs font-bold text-white block">Lumajang Kota</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Food Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-white/90 text-slate-800 relative">
              {/* Top Badge */}
              <div className="absolute top-0 right-0 bg-[#0284C7] text-white px-3.5 py-1 rounded-bl-2xl text-[10px] font-heading font-black tracking-wider uppercase">
                MENU FAVORIT STAND
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[#0284C7]" />
                <h3 className="font-heading font-black text-base text-slate-800">
                  5 Menu Pilihan Khas 12B
                </h3>
              </div>

              {/* 3 Featured Products Mini Showcase */}
              <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                {OFFICIAL_PRODUCTS.slice(1, 4).map((p) => (
                  <div
                    key={p.id}
                    className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-sky-300 transition-all hover:-translate-y-0.5 flex flex-col"
                  >
                    <div className="aspect-square overflow-hidden bg-sky-100 relative">
                      <img
                        src={p.image}
                        alt={p.alt}
                        className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
                        loading="eager"
                      />
                      {p.id === 'es-gabin' && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-sky-600/90 text-white text-[8px] font-bold rounded">
                          Dingin
                        </span>
                      )}
                    </div>
                    <div className="p-2 text-center flex-1 flex flex-col justify-between">
                      <div className="text-[11px] font-heading font-bold text-slate-800 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] font-heading font-black text-[#0284C7] mt-0.5">
                        Rp{p.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">Rating 4.9 • Rasa Terjamin Enak</span>
                </div>
                <button
                  onClick={scrollToCatalog}
                  className="font-heading font-bold text-[#0284C7] hover:underline text-[11px] flex items-center gap-1"
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
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 truncate">Harga Pelajar</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Mulai Rp3.000 s/d Rp9.000</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 truncate">100% Higienis</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Olahan segar siswa 12B</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 truncate">Layanan Cepat</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Konfirmasi via WA Admin</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 shadow-sm border border-white/60 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 truncate">Target 25 / Hari</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Fresh order rollover</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
