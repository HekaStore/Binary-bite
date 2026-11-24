'use client';

import React, { useState, useMemo } from 'react';
import { OFFICIAL_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductCategory } from '@/types';
import { Search, ArrowRight, Utensils, Coffee, Image as ImageIcon, Sparkles, X } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default');
  const [showPosterModal, setShowPosterModal] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...OFFICIAL_PRODUCTS];

    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="katalog" className="py-20 sm:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 border border-sky-200 text-[#0284C7] rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>DAFTAR MENU RESMI STAND 12B</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight uppercase">
              Katalog Sajian Kuliner Pilihan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Kapasitas 25 pcs per menu setiap hari (khusus Es Gabin hari Jumat 75 pcs). Bebas pilih tanggal 27, 28, atau 29 November 2026.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPosterModal(true)}
              className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#0284C7] hover:text-[#0369A1] transition-all py-2.5 px-4 bg-white border border-sky-200 rounded-full shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 min-h-[44px]"
            >
              <ImageIcon className="w-4 h-4 text-[#0284C7]" />
              <span>Lihat Poster Menu Stand</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills & Instant Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Pills (Touch Target >= 44px) */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('Semua')}
              className={`px-4 py-2.5 min-h-[44px] text-xs font-heading font-bold rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center ${
                selectedCategory === 'Semua'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              Semua Menu ({OFFICIAL_PRODUCTS.length})
            </button>

            <button
              onClick={() => setSelectedCategory('Makanan')}
              className={`px-4 py-2.5 min-h-[44px] text-xs font-heading font-bold rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 ${
                selectedCategory === 'Makanan'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Makanan & Kudapan (4)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('Minuman')}
              className={`px-4 py-2.5 min-h-[44px] text-xs font-heading font-bold rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 ${
                selectedCategory === 'Minuman'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Minuman Segar (1)</span>
            </button>
          </div>

          {/* Search Bar & Price Sort */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu favoritmu..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0284C7] shadow-sm min-h-[44px]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-heading font-bold text-slate-700 focus:outline-none focus:border-[#0284C7] shadow-sm min-h-[44px]"
            >
              <option value="default">Urutkan: Rekomendasi</option>
              <option value="asc">Harga: Termurah</option>
              <option value="desc">Harga: Termahal</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-sky-100 p-8 shadow-sm">
            <p className="text-sm font-heading font-bold text-slate-600">
              Tidak ada menu yang sesuai dengan pencarian "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-5 py-2.5 bg-[#0284C7] text-white text-xs font-heading font-bold rounded-full hover:bg-[#0369A1] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Stand Menu Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h4 className="font-heading font-black text-sm text-slate-800">
                Poster Resmi Stand Binary Bite (XII B)
              </h4>
              <button
                onClick={() => setShowPosterModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                aria-label="Tutup poster"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[1/1] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
              <img
                src="/images/stand-menu.jpg"
                alt="Stand Binary Bite Poster"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
