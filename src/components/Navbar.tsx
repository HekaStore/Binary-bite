'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, ShieldCheck, Utensils, Send } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      <div className="w-full bg-[#0284C7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo with Mascot */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/80 bg-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/images/logo.jpg"
                  alt="Logo BINARY.BITE"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-mono truncate">
                    BINARY<span className="text-sky-200">.BITE</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-sm flex-shrink-0">
                    XII B
                  </span>
                </div>
                <p className="text-[9px] sm:text-[11px] font-medium tracking-wider text-sky-100 uppercase truncate">
                  Digital Canteen & Food Festival
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-white/90">
              <button
                onClick={() => scrollToSection('beranda')}
                className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('katalog')}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Utensils className="w-4 h-4 text-sky-200" />
                Menu Makanan
              </button>
              <button
                onClick={() => scrollToSection('cara-pemesanan')}
                className="hover:text-white transition-colors"
              >
                Cara Pesan
              </button>
              <button
                onClick={() => scrollToSection('tentang')}
                className="hover:text-white transition-colors"
              >
                Tentang Kami
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:text-white transition-colors"
              >
                FAQ
              </button>
            </nav>

            {/* Actions: Cart, POS & Order CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-900 bg-white/90 hover:bg-white rounded-full transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Kasir Stand</span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-white text-[#0284C7] rounded-full hover:bg-sky-50 shadow-md transition-all active:scale-95"
                aria-label="Keranjang Belanja"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sky-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Order Now Pill (styled like the Sign In pill in reference) */}
              <button
                onClick={() => scrollToSection('katalog')}
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0284C7] font-bold text-xs uppercase tracking-wider rounded-full hover:bg-sky-50 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pesan Sekarang</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0284C7] text-white border-t border-sky-400 px-6 py-5 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3.5">
            <button
              onClick={() => scrollToSection('beranda')}
              className="text-left py-2 font-semibold hover:text-sky-200"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('katalog')}
              className="text-left py-2 font-semibold hover:text-sky-200 flex items-center gap-2"
            >
              <Utensils className="w-4 h-4 text-sky-200" />
              Menu Makanan & Minuman
            </button>
            <button
              onClick={() => scrollToSection('cara-pemesanan')}
              className="text-left py-2 font-semibold hover:text-sky-200"
            >
              Cara Pemesanan
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="text-left py-2 font-semibold hover:text-sky-200"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-2 font-semibold hover:text-sky-200"
            >
              FAQ
            </button>

            <div className="pt-3 border-t border-sky-400/50 flex flex-col gap-2.5">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 bg-white text-[#0284C7] font-bold text-xs rounded-xl"
              >
                <ShieldCheck className="w-4 h-4" />
                POS Kasir Stand
              </Link>
              <button
                onClick={() => scrollToSection('katalog')}
                className="py-3 bg-sky-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Pesan Menu Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
