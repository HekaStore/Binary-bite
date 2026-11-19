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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white border-l border-sky-100 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white border border-sky-200 rounded-2xl text-[#0284C7] shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-slate-800 leading-tight">
                Keranjang Pesanan
              </h3>
              <p className="text-xs font-heading font-bold text-[#0284C7]">
                {totalItems} item dipilih
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] mb-4 shadow-sm">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-heading font-black text-lg text-slate-800">
                Keranjang Masih Kosong
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-xs leading-relaxed">
                Pilih menu lezat favoritmu dari katalog stand kami dan tambahkan ke keranjang!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-heading font-black rounded-full shadow-btn-sky transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Pilih Menu Sekarang
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:border-sky-300 transition-all flex gap-3 relative group"
              >
                {/* Product thumbnail */}
                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-sky-50/50 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-[1.025] transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="font-heading font-bold text-sm text-slate-800 truncate">
                      {item.product.name}
                    </h5>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                      title="Hapus produk"
                      aria-label="Hapus produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedFlavor && (
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-heading font-bold bg-sky-50 text-[#0284C7] border border-sky-200 rounded-full mt-1">
                      Rasa: {item.selectedFlavor}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                    <span className="font-heading font-black text-sm text-[#0284C7]">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>

                    {/* Stepper with touch targets */}
                    <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#0284C7] font-bold hover:bg-sky-100 text-xs shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-heading font-black text-xs text-[#0284C7]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#0284C7] flex items-center justify-center text-white font-bold hover:bg-[#0369A1] text-xs shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Delete Confirmation Overlay */}
                {confirmDeleteId === item.id && (
                  <div className="absolute inset-0 bg-slate-900/90 text-white rounded-2xl p-3 flex flex-col justify-center items-center z-20 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-2 text-sky-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Hapus item ini dari keranjang?</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmDelete(item.id, item.product.name)}
                        className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3.5 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-full hover:bg-slate-600 transition-colors"
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
          <div className="p-5 border-t border-sky-100 bg-white space-y-3 shadow-lg">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Total Item</span>
                <span className="font-heading font-bold text-slate-800">{totalItems} pcs</span>
              </div>
              <div className="flex justify-between text-base font-heading font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Pembayaran</span>
                <span className="font-heading font-black text-xl text-[#0284C7]">
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
                  className="w-full py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-heading font-black rounded-full shadow-btn-sky flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-xs sm:text-sm uppercase tracking-wider"
                >
                  <span>Lanjut ke Formulir Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-heading font-black rounded-full shadow-btn-sky flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-xs sm:text-sm uppercase tracking-wider"
                >
                  <span>Lanjut ke Formulir Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={clearCart}
                className="w-full py-2 text-xs font-medium text-slate-400 hover:text-red-600 transition-colors"
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
