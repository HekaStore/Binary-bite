'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_INFO } from '@/data/products';
import { ArrowUp, Instagram, MessageCircle, MapPin, Calendar, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-cobalt text-brand-white border-t-2 border-brand-royal pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-brand-royal">
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-sky bg-brand-white flex-shrink-0 shadow-flat-sm">
                <img
                  src="/images/logo.jpg"
                  alt="Logo Resmi BINARY.BITE"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-mono text-xl font-black tracking-tight text-brand-white">
                  BINARY<span className="text-brand-sky">.BITE</span>
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-brand-sky uppercase">
                  Class 12B Digital Canteen
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-brand-sky/80 leading-relaxed max-w-sm">
              “{BRAND_INFO.tagline}” — Festival kuliner kreatif karya siswa-siswi kelas 12B. 
              Presisi digital dalam pelayanan, kelezatan tiada tara di setiap gigitan.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-brand-royal border border-brand-sky/40 rounded-lg text-brand-white">
                Event: {BRAND_INFO.eventDateText}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-sky">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#beranda" className="text-brand-white/80 hover:text-brand-sky transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#katalog" className="text-brand-white/80 hover:text-brand-sky transition-colors">
                  Katalog 5 Menu
                </a>
              </li>
              <li>
                <a href="#cara-pemesanan" className="text-brand-white/80 hover:text-brand-sky transition-colors">
                  Cara Pemesanan
                </a>
              </li>
              <li>
                <a href="#tentang" className="text-brand-white/80 hover:text-brand-sky transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-brand-sky hover:text-brand-white font-mono font-semibold">
                  Akses POS Kasir Stand (PIN: 1212)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-sky">
              Kontak & Lokasi Stand
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-brand-white/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-sky flex-shrink-0 mt-0.5" />
                <span>{BRAND_INFO.standLocation}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-brand-sky flex-shrink-0" />
                <span>Jumat, 27 November 2026 (07:00 - Selesai WIB)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-brand-sky flex-shrink-0" />
                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-mono"
                >
                  {BRAND_INFO.whatsappRaw} (Nisrina)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-brand-sky flex-shrink-0" />
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-mono"
                >
                  {BRAND_INFO.instagram}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-sky/70">
          <div>
            © 2026 BINARY.BITE — Kelas 12B. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-royal hover:bg-brand-sky hover:text-brand-cobalt text-brand-white rounded-lg border border-brand-sky/30 transition-colors"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

