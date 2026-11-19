'use client';

import React, { useState, useMemo } from 'react';
import { OFFICIAL_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductCategory } from '@/types';
import { Search, Filter, ArrowUpDown, Utensils, Coffee, Sparkles, Image as ImageIcon } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default');
  const [showPosterModal, setShowPosterModal] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...OFFICIAL_PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      );
    }

    // Sort by price
    if (sortBy === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="katalog" className="py-16 sm:py-24 bg-brand-white border-b-2 border-brand-cobalt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sky border border-brand-royal rounded-md text-xs font-mono font-bold text-brand-cobalt mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-electric" />
              <span>OFFICIAL MENU KATALOG</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-cobalt tracking-tight">
              PILIHAN MENU SPESIAL BINARY.BITE
            </h2>
            <p className="text-sm sm:text-base text-brand-slate font-medium mt-1">
              Dibuat dengan bahan pilihan terbaik, higienis, dan terjamin cita rasanya.
            </p>
          </div>

          {/* Quick Button to View Original Stand Poster */}
          <button
            onClick={() => setShowPosterModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-white border-2 border-brand-cobalt rounded-xl text-xs sm:text-sm font-bold text-brand-cobalt hover:bg-brand-sky transition-colors shadow-sm self-start md:self-auto"
          >
            <ImageIcon className="w-4 h-4 text-brand-royal" />
            <span>Lihat Poster Menu Stand XII B</span>
          </button>
        </div>

        {/* Filter, Search & Sort Bar */}
        <div className="bg-brand-sky border-2 border-brand-cobalt rounded-2xl p-4 sm:p-6 mb-10 shadow-flat-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Category Tabs */}
            <div className="md:col-span-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('Semua')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                  selectedCategory === 'Semua'
                    ? 'bg-brand-cobalt text-brand-white border-brand-cobalt shadow-sm'
                    : 'bg-brand-white text-brand-slate border-brand-royal hover:bg-brand-white/80'
                }`}
              >
                Semua ({OFFICIAL_PRODUCTS.length})
              </button>
              <button
                onClick={() => setSelectedCategory('Makanan')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
                  selectedCategory === 'Makanan'
                    ? 'bg-brand-cobalt text-brand-white border-brand-cobalt shadow-sm'
                    : 'bg-brand-white text-brand-slate border-brand-royal hover:bg-brand-white/80'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                Makanan (4)
              </button>
              <button
                onClick={() => setSelectedCategory('Minuman')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
                  selectedCategory === 'Minuman'
                    ? 'bg-brand-cobalt text-brand-white border-brand-cobalt shadow-sm'
                    : 'bg-brand-white text-brand-slate border-brand-royal hover:bg-brand-white/80'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                Minuman (1)
              </button>
            </div>

            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu favoritmu..."
                className="w-full pl-10 pr-4 py-2.5 bg-brand-white border-2 border-brand-royal rounded-xl text-xs sm:text-sm text-brand-slate placeholder:text-brand-muted font-medium focus:outline-none focus:border-brand-cobalt"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-brand-muted hover:text-brand-slate"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-brand-royal flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-brand-white border-2 border-brand-royal rounded-xl text-xs sm:text-sm font-semibold text-brand-cobalt focus:outline-none focus:border-brand-cobalt"
              >
                <option value="default">Urutkan: Rekomendasi</option>
                <option value="asc">Harga: Termurah (Rp3K)</option>
                <option value="desc">Harga: Termahal (Rp9K)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-sky border-2 border-dashed border-brand-royal rounded-2xl p-8">
            <Utensils className="w-12 h-12 text-brand-royal mx-auto mb-3" />
            <h3 className="font-extrabold text-lg text-brand-cobalt">Menu Tidak Ditemukan</h3>
            <p className="text-sm text-brand-slate mt-1 max-w-sm mx-auto">
              Tidak ada menu yang sesuai dengan pencarian "{searchQuery}". Silakan coba kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-4 px-4 py-2 bg-brand-cobalt text-brand-white text-xs font-bold rounded-lg hover:bg-brand-royal"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Stand Menu Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate/80 animate-in fade-in">
          <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl max-w-lg w-full p-5 relative shadow-flat-lg">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-line">
              <h4 className="font-extrabold text-base text-brand-cobalt">
                Poster Resmi Stand Binary Bite (XII B)
              </h4>
              <button
                onClick={() => setShowPosterModal(false)}
                className="w-8 h-8 rounded-lg bg-brand-sky text-brand-cobalt font-bold flex items-center justify-center hover:bg-brand-royal hover:text-brand-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[1/1] overflow-hidden rounded-xl border border-brand-royal bg-black">
              <img
                src="/images/stand-menu.jpg"
                alt="Stand Binary Bite Poster"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-brand-muted font-mono mt-3 text-center">
              SMA Negeri 1 Lumajang • Stand Kelas XII B • Jumat, 27 November 2026
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

