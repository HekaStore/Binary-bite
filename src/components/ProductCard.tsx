'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/utils/formatters';
import { Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity, getItemQuantity, items } = useCart();
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
    <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-5 flex flex-col justify-between shadow-flat-md hover:shadow-solid-cobalt hover:-translate-y-1 transition-all duration-200">
      <div>
        {/* Top Header Badge & Code */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-sky text-brand-cobalt border border-brand-royal rounded">
            {product.code}
          </span>
          <span className="font-mono text-[11px] font-bold text-brand-electric">
            {product.badge}
          </span>
        </div>

        {/* Product Image Container */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-line bg-slate-50 flex items-center justify-center p-3 mb-4 group">
          <img
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          {currentQuantity > 0 && (
            <div className="absolute top-2 right-2 px-2.5 py-1 bg-brand-electric text-brand-white text-xs font-mono font-bold rounded-lg border border-brand-cobalt flex items-center gap-1 shadow-flat-sm">
              <Check className="w-3.5 h-3.5" />
              <span>{currentQuantity} di Keranjang</span>
            </div>
          )}
        </div>

        {/* Title & Category */}
        <div className="mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-extrabold text-lg sm:text-xl text-brand-cobalt">
              {product.name}
            </h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-white border border-brand-royal text-brand-royal rounded-full">
              {product.category}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mt-1.5 font-medium line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Flavor Selector if available (e.g. Es Gabin) */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brand-line">
            <span className="text-[11px] font-mono font-bold text-brand-muted block mb-1.5 uppercase">
              Pilihan Rasa:
            </span>
            <div className="flex gap-2">
              {product.flavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                    selectedFlavor === flavor
                      ? 'bg-brand-royal text-brand-white border-brand-cobalt shadow-sm'
                      : 'bg-brand-white text-brand-slate border-brand-line hover:border-brand-royal'
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Price & Counter/Add Button */}
      <div className="mt-5 pt-4 border-t-2 border-brand-line flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-semibold text-brand-muted block uppercase">
            Harga Satuan
          </span>
          <span className="font-mono text-lg sm:text-xl font-extrabold text-brand-cobalt">
            {formatRupiah(product.price)}
          </span>
          <span className="text-xs font-mono text-brand-muted"> / pcs</span>
        </div>

        {/* Action Button: Stepper or Add button */}
        {currentQuantity > 0 ? (
          <div className="flex items-center gap-1.5 bg-brand-sky border-2 border-brand-cobalt rounded-xl p-1">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 rounded-lg bg-brand-white border border-brand-royal flex items-center justify-center text-brand-cobalt hover:bg-brand-royal hover:text-brand-white transition-colors"
              aria-label="Kurangi kuantitas"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono font-bold text-sm text-brand-cobalt">
              {currentQuantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-lg bg-brand-cobalt border border-brand-cobalt flex items-center justify-center text-brand-white hover:bg-brand-royal transition-colors"
              aria-label="Tambah kuantitas"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-brand-cobalt text-brand-white text-xs sm:text-sm font-bold rounded-xl border border-brand-cobalt hover:bg-brand-royal active:translate-y-0.5 transition-all flex items-center gap-1.5 shadow-solid-electric"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>+ Keranjang</span>
          </button>
        )}
      </div>
    </div>
  );
};

