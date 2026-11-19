'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_INFO } from '@/data/products';
import { ArrowUp, Instagram, MessageCircle, MapPin, Calendar, Star, Utensils, Award, Users, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0284C7] text-white">
      {/* Blue Stats & Testimonial Bar (Directly matching the bottom banner in the reference) */}
      <div className="border-b border-sky-400/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-200 mb-1">
                <Utensils className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Varian Menu</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">5 Pilihan</div>
              <div className="text-xs text-sky-100 font-medium">Makanan & Minuman</div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-200 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Kualitas</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">100%</div>
              <div className="text-xs text-sky-100 font-medium">Segar & Higienis</div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-200 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Harga</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">3K - 9K</div>
              <div className="text-xs text-sky-100 font-medium">Ramah Kantong</div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-200 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Jam Buka</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">07:00</div>
              <div className="text-xs text-sky-100 font-medium">Jumat, 27 Nov WIB</div>
            </div>
          </div>

          {/* Right: Folded Origami Testimonial Card (Matches the origami quote card in reference) */}
          <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl p-5 shadow-card-paper relative overflow-hidden">
            {/* Top folded corner */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-sky-100 rounded-bl-2xl shadow-inner" />

            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 italic leading-relaxed mb-3">
              “Sajian kuliner terbaik dari kelas 12B! Rasanya pas, es gabin dingin mantap, dan kemasannya sangat rapi.”
            </p>

            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
              <span className="text-[#0284C7] font-mono">Stand Binary Bite XII B</span>
              <span className="text-slate-400">SMA Negeri 1 Lumajang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-sky-400/30">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white flex-shrink-0">
                <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-mono text-xl font-black text-white">
                BINARY<span className="text-sky-200">.BITE</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-sm font-medium">
              “{BRAND_INFO.tagline}” — Proyek festival kewirausahaan PKWU dari kelas 12B. Menghadirkan kenikmatan kuliner modern dengan presisi pemesanan digital.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-sky-200 uppercase tracking-wider">
              Tautan Halaman
            </h4>
            <ul className="space-y-1.5 text-xs text-sky-100">
              <li><a href="#beranda" className="hover:text-white">Beranda</a></li>
              <li><a href="#katalog" className="hover:text-white">Menu Makanan</a></li>
              <li><a href="#cara-pemesanan" className="hover:text-white">Cara Pemesanan</a></li>
              <li><a href="#tentang" className="hover:text-white">Tentang Kami</a></li>
              <li><Link href="/admin" className="text-white font-bold hover:underline">POS Kasir Stand</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-sky-200 uppercase tracking-wider">
              Kontak & Lokasi Stand
            </h4>
            <div className="space-y-1.5 text-xs text-sky-100">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-200" />
                <span>{BRAND_INFO.standLocation}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-sky-200" />
                <a href={BRAND_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {BRAND_INFO.whatsappRaw} (Nisrina)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-sky-200" />
                <a href={BRAND_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {BRAND_INFO.instagram}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-200">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© 2026 BINARY.BITE • Stand Kelas 12B. All rights reserved.</span>
            <span className="hidden sm:inline text-sky-300/40">•</span>
            <a
              href="https://hekaportfolio.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all hover:scale-105 border border-white/20 shadow-sm"
              title="Kunjungi Portfolio HekaLabs Studio"
            >
              <span className="text-sky-200">Built by</span>
              <span className="font-bold text-white underline decoration-sky-300 decoration-1 underline-offset-2">HekaLabs Studio</span>
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
