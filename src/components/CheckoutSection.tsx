'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Order, PickupMethod } from '@/types';
import { generateTransactionId, formatRupiah } from '@/utils/formatters';
import { calculateNextOrderAllocation, QuotaAllocation } from '@/utils/dailyQuota';
import { ReceiptModal } from '@/components/ReceiptModal';
import { ShoppingBag, Send, AlertCircle, User, Phone, MapPin, FileText, ArrowLeft, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export const CheckoutSection: React.FC = () => {
  const { items, totalPrice, totalItems, clearCart, addToast } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>('Lumajang Kota');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [existingOrders, setExistingOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('binary_bite_orders');
      if (raw) {
        setExistingOrders(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const allocation: QuotaAllocation = calculateNextOrderAllocation(existingOrders);

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
      scheduledDate: allocation.scheduledDate,
      scheduledDayIndex: allocation.scheduledDayIndex,
      dailyOrderNumber: allocation.dailyOrderNumber,
      isRollover: allocation.isRollover,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('binary_bite_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('binary_bite_orders', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save order to localStorage', err);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#38BDF8', '#BAE6FD', '#0A2463'],
      });
    } catch {}

    setCreatedOrder(newOrder);
    clearCart();
    addToast('Pesanan berhasil dibuat! Silakan kirim detailnya via WhatsApp.', 'success');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda / Menu</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-mono font-bold border border-sky-200">
              01
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Formulir Pemesanan
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Lengkapi data di bawah ini untuk konfirmasi pesanan ke WhatsApp Admin.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Nama Lengkap Pemesan *</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Muhammad Rifki / Nisrina"
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0284C7] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Kelas / Instansi / No. WhatsApp Pemesan *</span>
              </label>
              <input
                type="text"
                required
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Contoh: Kelas 12B / 0812-3456-7890"
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0284C7] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Metode Pengambilan Pesanan</span>
              </label>
              <div className="p-3.5 sm:p-4 rounded-2xl border bg-sky-50/80 border-[#0284C7] shadow-sm flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                      Lumajang Kota
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0284C7] text-white">
                      Metode Resmi
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    Stand: Jl. AR Hakim, Ditotrunan, Lumajang
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Target 25 Pesanan / Hari & Jadwal Allocation Box */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                allocation.isRollover
                  ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                  : 'bg-sky-50/80 border-sky-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      allocation.isRollover
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-white text-[#0284C7] border border-sky-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Jadwal Pengambilan ({allocation.dayLabel})
                    </span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                      {allocation.scheduledDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">
                    Target Kuota Harian
                  </span>
                  <span
                    className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                      allocation.isRollover
                        ? 'bg-amber-200 text-amber-950 font-bold'
                        : 'bg-sky-200 text-[#0369A1] font-bold'
                    }`}
                  >
                    Pesanan #{allocation.dailyOrderNumber} / 25
                  </span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span>Kapasitas {allocation.dayLabel}:</span>
                  <span className="font-mono font-bold">
                    {allocation.currentDayOrdersCount} / 25 terisi (
                    {Math.round((allocation.currentDayOrdersCount / 25) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      allocation.isRollover ? 'bg-amber-500' : 'bg-[#0284C7]'
                    }`}
                    style={{
                      width: `${Math.min(100, (allocation.currentDayOrdersCount / 25) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {allocation.isRollover ? (
                <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-medium">
                  ⚠️ <strong>Ketentuan Kuota:</strong> Kuota Hari ke-
                  {allocation.scheduledDayIndex - 1} telah mencapai target maksimal 25 pesanan. Sesuai
                  kebijakan stand kami, pesanan Anda otomatis dialokasikan ke{' '}
                  <strong>Hari Selanjutnya ({allocation.scheduledDate})</strong>.
                </div>
              ) : (
                <p className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                  *Target produksi kami 25 pesanan per hari untuk menjaga kesegaran olahan. Jika kuota hari ini penuh, selebihnya dialihkan ke hari selanjutnya.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Catatan Tambahan (Opsional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Es Capcin esnya sedang saja, roll abon jangan pedas."
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0284C7] focus:bg-white transition-all"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-extrabold rounded-full shadow-btn-sky transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Buat Struk & Kirim via WhatsApp</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                *Pesanan langsung diarahkan ke WhatsApp Admin Nisrina (0858-4378-8915)
              </p>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-card-paper border border-sky-100">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-800">
              Ringkasan Pesanan
            </h3>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-sky-50 text-[#0284C7] rounded-full border border-sky-100">
              {totalItems} Item
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                Belum ada menu di keranjang.
              </p>
              <Link
                href="/#katalog"
                className="mt-3 inline-block px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Pilih Menu Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                        {item.product.name}
                        {item.selectedFlavor && ` (${item.selectedFlavor})`}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500">
                        {formatRupiah(item.product.price)} x {item.quantity} pcs
                      </p>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-[#0284C7]">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Produk</span>
                  <span className="font-mono font-bold">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Biaya Pengantaran</span>
                  <span className="font-mono font-bold text-[#0284C7]">GRATIS</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Pembayaran</span>
                  <span className="font-mono text-lg text-[#0284C7]">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {createdOrder && (
        <ReceiptModal
          order={createdOrder}
          onClose={() => setCreatedOrder(null)}
        />
      )}
    </div>
  );
};
