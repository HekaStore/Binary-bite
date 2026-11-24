'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_INFO } from '@/data/products';
import { Wrench, MessageCircle, ShieldCheck, Clock, Store, Sparkles, AlertCircle } from 'lucide-react';

export const MaintenanceScreen: React.FC = () => {
  const waMaintenanceUrl = `${BRAND_INFO.whatsappUrl}?text=${encodeURIComponent(
    'Halo Admin BINARY.BITE, saya ingin menanyakan pemesanan stand kuliner Kelas 12B selagi website sedang pemeliharaan.'
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex flex-col items-center justify-between px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative Sky Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-200/30 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-100/50 blur-2xl rounded-full pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-100/50 blur-2xl rounded-full pointer-events-none" />

      {/* Top Header Logo */}
      <header className="relative z-10 flex items-center gap-3">
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-sm border border-sky-200">
          <Image
            src="/images/logo.jpg"
            alt="BINARY.BITE Official Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <span className="font-heading font-black tracking-wider text-slate-900 text-sm sm:text-base block">
            BINARY<span className="text-[#0284C7]">.BITE</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            Digital Canteen & Food Festival • Kelas 12B
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 max-w-xl w-full my-auto py-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-xl shadow-sky-900/5 text-center space-y-6">
          {/* Status Badge with Pulsing Live Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-heading font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Mode Pemeliharaan & Peningkatan Sistem</span>
          </div>

          {/* Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100/80 rounded-2xl mx-auto flex items-center justify-center border border-sky-200/60 shadow-inner">
            <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-[#0284C7] animate-pulse" />
          </div>

          {/* Heading and Description */}
          <div className="space-y-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
              Sistem Sedang Ditingkatkan
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Website pemesanan <strong className="text-slate-800">BINARY.BITE</strong> sedang dalam tahap pemeliharaan
              dan peningkatan performa untuk memastikan seluruh pesanan stand berjalan lebih cepat, aman, dan lancar.
            </p>
          </div>

          {/* Event Schedule Assurance Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-slate-800">
              <Clock className="w-4 h-4 text-[#0284C7]" />
              <span>Jadwal Festival Kuliner Stand 12B Tetap Berjalan:</span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 pl-6">
              📅 {BRAND_INFO.eventDaysDetailed}
              <br />
              📍 {BRAND_INFO.standLocation}
            </p>
          </div>

          {/* Interactive Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {/* WhatsApp Contact */}
            <a
              href={waMaintenanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-heading font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pesan via WhatsApp Kasir</span>
            </a>

            {/* Admin Portal Bypass Link */}
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-heading font-bold border border-slate-200 transition-all active:scale-95"
            >
              <Store className="w-4 h-4 text-[#0284C7]" />
              <span>Portal Kasir Stand 12B</span>
            </Link>
          </div>

          {/* Security Notice */}
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Seluruh data pesanan yang telah tercatat tetap tersimpan aman di sistem cloud.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-400 space-y-1">
        <p>© 2026 BINARY.BITE Kelas 12B. One Bite, Endless Happiness!</p>
        <p className="text-[10px] text-slate-400">
          Stand Kuliner & Festival Makanan Tradisional-Modern Lumajang
        </p>
      </footer>
    </div>
  );
};
