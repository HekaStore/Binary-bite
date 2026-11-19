'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, ShieldCheck, Terminal, Utensils } from 'lucide-react';
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
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-brand-white border-b-2 border-brand-cobalt shadow-flat-md'
          : 'bg-brand-white border-b border-brand-line'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-brand-cobalt border-2 border-brand-royal rounded-xl flex items-center justify-center text-brand-white shadow-flat-sm group-hover:bg-brand-royal transition-colors">
              <span className="font-mono font-bold text-sm tracking-tighter text-brand-sky">
                01
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-extrabold text-xl tracking-tight text-brand-cobalt">
                  BINARY<span className="text-brand-electric">.BITE</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-brand-sky text-brand-cobalt border border-brand-royal rounded">
                  XII B
                </span>
              </div>
              <p className="text-[10px] font-mono font-semibold tracking-wider text-brand-muted uppercase">
                Digital Canteen
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('beranda')}
              className="text-sm font-semibold text-brand-slate hover:text-brand-electric transition-colors"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('katalog')}
              className="text-sm font-semibold text-brand-slate hover:text-brand-electric transition-colors flex items-center gap-1.5"
            >
              <Utensils className="w-4 h-4 text-brand-royal" />
              Katalog
            </button>
            <button
              onClick={() => scrollToSection('cara-pemesanan')}
              className="text-sm font-semibold text-brand-slate hover:text-brand-electric transition-colors"
            >
              Cara Pemesanan
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="text-sm font-semibold text-brand-slate hover:text-brand-electric transition-colors"
            >
              Tentang Kami
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold text-brand-cobalt bg-brand-sky border border-brand-royal rounded-lg hover:bg-brand-royal hover:text-brand-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Kasir / Admin
            </Link>
          </nav>

          {/* Actions: Cart & Order CTA */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-brand-sky border border-brand-royal text-brand-cobalt rounded-xl hover:bg-brand-royal hover:text-brand-white transition-colors"
              aria-label="Buka keranjang belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-electric border-2 border-brand-white text-brand-white text-xs font-mono font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop CTA */}
            <button
              onClick={() => scrollToSection('katalog')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-brand-cobalt text-brand-white text-sm font-bold rounded-xl border border-brand-cobalt shadow-solid-electric hover:bg-brand-royal active:translate-y-0.5 transition-all"
            >
              Order Now
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-cobalt rounded-lg hover:bg-brand-sky transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-brand-cobalt bg-brand-white px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('beranda')}
              className="text-left py-2 px-3 text-sm font-semibold text-brand-slate hover:bg-brand-sky rounded-lg"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('katalog')}
              className="text-left py-2 px-3 text-sm font-semibold text-brand-slate hover:bg-brand-sky rounded-lg flex items-center gap-2"
            >
              <Utensils className="w-4 h-4 text-brand-royal" />
              Katalog Menu
            </button>
            <button
              onClick={() => scrollToSection('cara-pemesanan')}
              className="text-left py-2 px-3 text-sm font-semibold text-brand-slate hover:bg-brand-sky rounded-lg"
            >
              Cara Pemesanan
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="text-left py-2 px-3 text-sm font-semibold text-brand-slate hover:bg-brand-sky rounded-lg"
            >
              Tentang Kami
            </button>
            <div className="pt-2 border-t border-brand-line flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-mono font-bold bg-brand-sky border border-brand-royal text-brand-cobalt rounded-xl"
              >
                <Terminal className="w-4 h-4" />
                POS Kasir & Admin Stand
              </Link>
              <button
                onClick={() => scrollToSection('katalog')}
                className="w-full py-3 bg-brand-cobalt text-brand-white text-sm font-bold rounded-xl shadow-solid-electric hover:bg-brand-royal"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

