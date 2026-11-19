'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Order, PickupMethod } from '@/types';
import { generateTransactionId, formatRupiah, createWhatsAppOrderUrl } from '@/utils/formatters';
import { ReceiptModal } from '@/components/ReceiptModal';
import { BRAND_INFO } from '@/data/products';
import { ShoppingBag, Send, AlertCircle, CheckCircle2, User, Phone, MapPin, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export const CheckoutSection: React.FC = () => {
  const { items, totalPrice, totalItems, clearCart, addToast } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>('Ambil di Stand 12B');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorMsg('Keranjang pesanan Anda masih kosong. Silakan pilih menu terlebih dahulu.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg('Nama lengkap pemesan wajib diisi.');
      return;
    }

    if (!customerContact.trim()) {
      setErrorMsg('Kelas / Instansi / No. WhatsApp pemesan wajib diisi.');
      return;
    }

    setErrorMsg('');

    // Create Order Object
    const newOrder: Order = {
      id: generateTransactionId(),
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      pickupMethod,
      notes: notes.trim() || '-',
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedFlavor: item.selectedFlavor,
        subtotal: item.product.price * item.quantity,
      })),
      totalPrice,
      totalItems,
      status: 'Menunggu konfirmasi',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage orders list
    try {
      const existing = JSON.parse(localStorage.getItem('binary_bite_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('binary_bite_orders', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save order to localStorage', err);
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0A2463', '#1E56A0', '#2563EB', '#D6E6F2'],
      });
    } catch {}

    // Show modal & clear cart
    setCreatedOrder(newOrder);
    clearCart();
    addToast('Pesanan berhasil dibuat! Silakan kirim detailnya via WhatsApp.', 'success');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-royal hover:text-brand-cobalt transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda / Menu</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-7 bg-brand-white border-2 border-brand-cobalt rounded-2xl p-6 sm:p-8 shadow-flat-md">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-brand-line">
            <div className="w-10 h-10 rounded-xl bg-brand-cobalt text-brand-white flex items-center justify-center font-mono font-bold">
              01
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-cobalt">
                Formulir Pemesanan
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted font-medium">
                Lengkapi data di bawah ini untuk konfirmasi pesanan via WhatsApp.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-cobalt mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-royal" />
                <span>Nama Lengkap Pemesan *</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Muhammad Rifki / Nisrina"
                className="w-full px-4 py-3 bg-brand-white border-2 border-brand-royal rounded-xl text-sm font-medium text-brand-slate focus:outline-none focus:border-brand-cobalt"
              />
            </div>

            {/* Kelas / Instansi / No. WA */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-cobalt mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-royal" />
                <span>Kelas / Instansi / No. WhatsApp Pemesan *</span>
              </label>
              <input
                type="text"
                required
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Contoh: Kelas 12B / 0812-3456-7890"
                className="w-full px-4 py-3 bg-brand-white border-2 border-brand-royal rounded-xl text-sm font-medium text-brand-slate focus:outline-none focus:border-brand-cobalt"
              />
            </div>

            {/* Metode Pengambilan */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-cobalt mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-royal" />
                <span>Metode Pengambilan Pesanan</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPickupMethod('Ambil di Stand 12B')}
                  className={`p-3.5 text-left rounded-xl border-2 transition-all flex flex-col justify-between ${
                    pickupMethod === 'Ambil di Stand 12B'
                      ? 'bg-brand-sky border-brand-cobalt shadow-sm'
                      : 'bg-brand-white border-brand-line hover:border-brand-royal'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-brand-cobalt">
                    Ambil di Stand 12B
                  </span>
                  <span className="text-[11px] text-brand-muted mt-1">
                    Lapangan Utama Sekolah
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupMethod('Antar Area Sekolah')}
                  className={`p-3.5 text-left rounded-xl border-2 transition-all flex flex-col justify-between ${
                    pickupMethod === 'Antar Area Sekolah'
                      ? 'bg-brand-sky border-brand-cobalt shadow-sm'
                      : 'bg-brand-white border-brand-line hover:border-brand-royal'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-brand-cobalt">
                    Antar Area Sekolah
                  </span>
                  <span className="text-[11px] text-brand-muted mt-1">
                    Diantar ke ruang kelasmu
                  </span>
                </button>
              </div>
            </div>

            {/* Catatan Khusus */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-cobalt mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-royal" />
                <span>Catatan Tambahan (Opsional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Es Capcin esnya sedang saja, roll abon jangan pedas."
                className="w-full px-4 py-2.5 bg-brand-white border-2 border-brand-royal rounded-xl text-sm font-medium text-brand-slate focus:outline-none focus:border-brand-cobalt"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full py-4 bg-brand-cobalt text-brand-white text-base font-extrabold rounded-xl border border-brand-cobalt shadow-solid-electric hover:bg-brand-royal active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Buat Struk & Kirim Pesanan via WhatsApp</span>
              </button>
              <p className="text-[11px] font-mono text-center text-brand-muted mt-3">
                *Pesanan akan otomatis diteruskan ke WhatsApp Admin Nisrina (0858-4378-8915)
              </p>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-brand-sky border-2 border-brand-cobalt rounded-2xl p-6 shadow-solid-cobalt">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-brand-royal">
            <h3 className="font-extrabold text-lg text-brand-cobalt">
              Ringkasan Pesanan
            </h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-white text-brand-cobalt border border-brand-royal rounded">
              {totalItems} Item
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-bold text-brand-slate">
                Belum ada menu di keranjang.
              </p>
              <Link
                href="/#katalog"
                className="mt-3 inline-block px-4 py-2 bg-brand-cobalt text-brand-white text-xs font-bold rounded-lg"
              >
                Pilih Menu Dulu
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-brand-white border border-brand-royal rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-brand-cobalt">
                        {item.product.name}
                        {item.selectedFlavor && ` (${item.selectedFlavor})`}
                      </h4>
                      <p className="text-[11px] font-mono text-brand-muted">
                        {formatRupiah(item.product.price)} x {item.quantity} pcs
                      </p>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-brand-cobalt">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t-2 border-brand-royal space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-brand-slate font-medium">
                  <span>Subtotal Produk</span>
                  <span className="font-mono font-bold">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-brand-slate font-medium">
                  <span>Biaya Pengambilan / Antar</span>
                  <span className="font-mono font-bold text-brand-electric">GRATIS</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-brand-cobalt pt-2 border-t border-brand-line">
                  <span>Total Pembayaran</span>
                  <span className="font-mono text-xl text-brand-electric">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-brand-white border border-brand-royal rounded-xl text-xs text-brand-slate">
                <span className="font-bold block text-brand-cobalt mb-0.5">
                  Informasi Penting:
                </span>
                Harap segera lakukan konfirmasi via WhatsApp setelah menekan tombol di samping agar kuota pesananmu langsung diproses kelas 12B!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal / Thermal Receipt View */}
      {createdOrder && (
        <ReceiptModal
          order={createdOrder}
          onClose={() => setCreatedOrder(null)}
        />
      )}
    </div>
  );
};

