'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/utils/formatters';
import { Plus, Minus, ArrowRight, Star, MapPin, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(
    product.flavors ? product.flavors[0] : undefined
  );

  const currentQuantity = getItemQuantity(product.id, selectedFlavor);
  const currentItemId = selectedFlavor ? `${product.id}-${selectedFlavor}` : product.id;

  const handleAdd = () => {
    addItem(product, selectedFlavor);
  };

  const handleIncrement = () => {
    updateQuantity(currentItemId, currentQuantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(currentItemId, currentQuantity - 1);
  };

  return (
    <div className="bg-white rounded-3xl p-3.5 shadow-card-paper hover:shadow-soft-float border border-sky-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group relative">
      {/* Folded Corner Badge / Dog-Ear Effect */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3.5 bg-sky-50">
        <img
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Origami Folded Corner Tab on Top Right (like in reference image) */}
        <div className="absolute top-0 right-0 bg-[#0284C7] text-white px-3 py-1 rounded-bl-xl text-[10px] font-mono font-bold tracking-wider shadow-sm flex items-center gap-1">
          <span>{product.code}</span>
        </div>

        {/* In-Cart Tag */}
        {currentQuantity > 0 && (
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-sky-900/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-md">
            <Check className="w-3.5 h-3.5 text-sky-300" />
            <span>{currentQuantity} dipilih</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="px-1.5 pb-2">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-800 tracking-tight group-hover:text-[#0284C7] transition-colors">
            {product.name}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-[#0284C7] rounded-full border border-sky-100">
            {product.category}
          </span>
        </div>

        {/* Location & Rating (Matching the reference layout) */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <MapPin className="w-3 h-3 text-[#0284C7]" />
            <span>Stand 12B</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Flavor Selector if product has options (e.g. Es Gabin) */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="mb-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rasa:</span>
              <div className="flex gap-1.5">
                {product.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all ${
                      selectedFlavor === flavor
                        ? 'bg-[#0284C7] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Price & Circular Action Button (Matching the Reference) */}
      <div className="px-1.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="font-extrabold text-lg sm:text-xl text-[#0284C7]">
            {formatRupiah(product.price)}
          </span>
          <span className="text-[10px] text-slate-400 block font-medium">/ per porsi</span>
        </div>

        {/* Action Button: Circular Pill or Stepper */}
        {currentQuantity > 0 ? (
          <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 rounded-full p-1">
            <button
              onClick={handleDecrement}
              className="w-7 h-7 rounded-full bg-white text-[#0284C7] hover:bg-sky-100 flex items-center justify-center font-bold text-xs shadow-sm transition-colors"
              aria-label="Kurangi kuantitas"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-mono font-bold text-xs text-[#0284C7]">
              {currentQuantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-7 h-7 rounded-full bg-[#0284C7] text-white hover:bg-[#0369A1] flex items-center justify-center font-bold text-xs shadow-sm transition-colors"
              aria-label="Tambah kuantitas"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="w-10 h-10 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center shadow-btn-sky hover:scale-105 active:scale-95 transition-all"
            title="Tambah ke Keranjang"
            aria-label="Tambah ke Keranjang"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
