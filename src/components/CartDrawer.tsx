'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  onOpenCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleConfirmDelete = (itemId: string, productName: string) => {
    removeItem(itemId, productName);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-brand-slate/60 backdrop-blur-none transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-brand-white border-l-2 border-brand-cobalt shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b-2 border-brand-cobalt flex items-center justify-between bg-brand-sky">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-white border border-brand-royal rounded-xl text-brand-cobalt">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-brand-cobalt leading-tight">
                Keranjang Pesanan
              </h3>
              <p className="text-xs font-mono font-semibold text-brand-royal">
                {totalItems} item dipilih
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-brand-cobalt hover:bg-brand-white rounded-xl transition-colors border border-transparent hover:border-brand-royal"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-2xl bg-brand-sky border-2 border-brand-royal flex items-center justify-center text-brand-royal mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-lg text-brand-cobalt">
                Keranjang Masih Kosong
              </h4>
              <p className="text-xs sm:text-sm text-brand-slate font-medium mt-1 max-w-xs">
                Yuk jelajahi menu lezat kami dan tambahkan camilan favoritmu!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2.5 bg-brand-cobalt text-brand-white text-xs sm:text-sm font-bold rounded-xl border border-brand-cobalt shadow-solid-electric hover:bg-brand-royal"
              >
                Pilih Menu Sekarang
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-brand-white border-2 border-brand-royal rounded-xl shadow-flat-sm flex gap-3 relative"
              >
                {/* Product thumbnail */}
                <div className="w-16 h-16 rounded-lg border border-brand-line bg-slate-50 flex items-center justify-center p-1.5 flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="font-bold text-sm text-brand-cobalt truncate">
                      {item.product.name}
                    </h5>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="text-brand-muted hover:text-red-600 p-1 rounded"
                      title="Hapus produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedFlavor && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-brand-sky text-brand-cobalt border border-brand-royal rounded mt-0.5">
                      Rasa: {item.selectedFlavor}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-brand-line">
                    <span className="font-mono text-sm font-extrabold text-brand-cobalt">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-brand-sky border border-brand-royal rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-brand-white flex items-center justify-center text-brand-cobalt font-bold hover:bg-brand-royal hover:text-brand-white text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-xs text-brand-cobalt">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-brand-cobalt flex items-center justify-center text-brand-white font-bold hover:bg-brand-royal text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Delete Confirmation Overlay */}
                {confirmDeleteId === item.id && (
                  <div className="absolute inset-0 bg-brand-cobalt text-brand-white rounded-xl p-3 flex flex-col justify-center items-center z-20 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-2 text-brand-sky">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Hapus item ini dari keranjang?</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmDelete(item.id, item.product.name)}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1 bg-brand-royal text-white text-xs font-bold rounded-lg hover:bg-brand-sky hover:text-brand-cobalt"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t-2 border-brand-cobalt bg-brand-white space-y-3">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-brand-slate font-medium">
                <span>Total Item</span>
                <span className="font-mono font-bold">{totalItems} pcs</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-brand-cobalt pt-2 border-t border-brand-line">
                <span>Total Pembayaran</span>
                <span className="font-mono text-xl text-brand-electric">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {onOpenCheckout ? (
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onOpenCheckout();
                  }}
                  className="w-full py-3.5 bg-brand-cobalt text-brand-white font-bold rounded-xl border border-brand-cobalt shadow-solid-electric hover:bg-brand-royal flex items-center justify-center gap-2 active:translate-y-0.5 transition-all text-sm"
                >
                  <span>Lanjut ke Formulir Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 bg-brand-cobalt text-brand-white font-bold rounded-xl border border-brand-cobalt shadow-solid-electric hover:bg-brand-royal flex items-center justify-center gap-2 active:translate-y-0.5 transition-all text-sm"
                >
                  <span>Lanjut ke Formulir Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={clearCart}
                className="w-full py-2 text-xs font-mono font-semibold text-brand-muted hover:text-red-600 transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

