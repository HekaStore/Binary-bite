'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_INFO } from '@/data/products';
import { PackageCheck, MessageCircle, ShieldCheck, Clock, Store } from 'lucide-react';

export const MaintenanceScreen: React.FC = () => {
  const waContactUrl = `${BRAND_INFO.whatsappUrl}?text=${encodeURIComponent(
    'Halo Admin BINARY.BITE, saya ingin menanyakan perihal pesanan stand kuliner Kelas 12B yang sudah saya pesan sebelumnya.'
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
          {/* Status Badge with Sold Out Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-heading font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>Pemesanan Resmi Ditutup • Sold Out</span>
          </div>

          {/* Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 rounded-2xl mx-auto flex items-center justify-center border border-rose-100 shadow-inner">
            <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600" />
          </div>

          {/* Heading and Description */}
          <div className="space-y-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
              Semua Menu Telah Habis Terjual!
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Terima kasih banyak atas antusiasme luar biasa dari seluruh teman-teman dan pelanggan! Seluruh kuota dan stok menu <strong className="text-slate-800">BINARY.BITE</strong> saat ini telah habis terjual (<strong>Out of Stock</strong>). Sistem pemesanan baru telah resmi ditutup agar tim produksi dapat menyiapkan pesanan terbaik.
            </p>
          </div>

          {/* Event Schedule Assurance Card for Existing Customers */}
          <div className="bg-sky-50/70 rounded-2xl p-4 sm:p-5 border border-sky-200/80 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-sky-900">
              <Clock className="w-4 h-4 text-[#0284C7]" />
              <span>Untuk Pelanggan yang Sudah Memesan Sebelumnya:</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Pesanan Anda <strong>tetap aman dan diproses</strong> sesuai jadwal yang telah Anda pilih pada saat checkout. Silakan datang dan ambil pesanan Anda sesuai tanggal:
            </p>
            <div className="text-[11px] font-mono text-slate-700 pl-6 bg-white/80 p-2.5 rounded-xl border border-sky-100 space-y-1">
              <div>📅 <strong>Jadwal Ambil:</strong> {BRAND_INFO.eventDaysDetailed}</div>
              <div>📍 <strong>Lokasi Stand:</strong> {BRAND_INFO.standLocation}</div>
              <div>🛍️ <strong>Metode Ambil:</strong> Sesuai pilihan (Ambil di Stand / Diantar)</div>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {/* WhatsApp Contact */}
            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-heading font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Admin Stand 12B</span>
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Seluruh data pesanan pelanggan tersimpan aman di database cloud Firebase.</span>
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
