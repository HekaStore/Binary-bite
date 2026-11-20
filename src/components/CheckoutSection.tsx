'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Order, PickupMethod } from '@/types';
import { generateTransactionId, formatRupiah } from '@/utils/formatters';
import {
  calculateAllocationForDay,
  calculateNextOrderAllocation,
  getDayQuotaSummaryList,
  checkItemsAvailabilityForDay,
  OFFICIAL_EVENT_DAYS,
  QuotaAllocation,
} from '@/utils/dailyQuota';
import { BRAND_INFO } from '@/data/products';
import { orderService } from '@/services/orderService';
import { ReceiptModal } from '@/components/ReceiptModal';
import {
  ShoppingBag,
  Send,
  AlertCircle,
  User,
  Phone,
  MapPin,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  Clock,
  Store,
  Truck,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export const CheckoutSection: React.FC = () => {
  const { items, totalPrice, totalItems, clearCart, addToast } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>('Ambil di Stand 12B');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [existingOrders, setExistingOrders] = useState<Order[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCloudOrders = async () => {
      const res = await orderService.getOrders();
      setExistingOrders(res.orders);
      const nextAlloc = calculateNextOrderAllocation(res.orders);
      setSelectedDayIndex(nextAlloc.scheduledDayIndex);
    };
    loadCloudOrders();
  }, []);

  const daySummaries = getDayQuotaSummaryList(existingOrders);
  const allocation: QuotaAllocation = calculateAllocationForDay(existingOrders, selectedDayIndex);
  const availability = checkItemsAvailabilityForDay(
    existingOrders,
    selectedDayIndex,
    items.map((i) => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (pickupMethod === 'Diantar di Lumajang Kota (Free Delivery)' && !deliveryAddress.trim()) {
      setErrorMsg('Alamat / lokasi pengantaran di Lumajang Kota wajib diisi untuk fasilitas Free Delivery.');
      return;
    }

    if (!availability.isAvailable) {
      if (availability.isDayLocked) {
        setErrorMsg(
          availability.lockedReason ||
            'Hari ke-1 harus terpenuhi 125 produk terlebih dahulu sebelum pesanan dialokasikan ke hari selanjutnya.'
        );
        return;
      }
      if (availability.exceededProducts.length > 0) {
        const prodDetails = availability.exceededProducts
          .map((p) => `${p.name} (sisa hari ini: ${p.remaining} pcs)`)
          .join(', ');
        setErrorMsg(
          `Menu ${prodDetails} melebihi kuota produksi 25 pcs per hari. Silakan alihkan jadwal ke Hari ${availability.recommendedDayIndex} atau sesuaikan porsi.`
        );
        return;
      }
      if (availability.isDayCapacityExceeded) {
        setErrorMsg(
          `Total pesanan untuk ${allocation.scheduledDate} sudah mencapai kapasitas maksimal 125 porsi. Silakan pilih Hari ${availability.recommendedDayIndex}.`
        );
        return;
      }
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const finalNotes =
      pickupMethod === 'Diantar di Lumajang Kota (Free Delivery)'
        ? `[DIANTAR] Alamat: ${deliveryAddress.trim()}${notes.trim() ? ` • Catatan: ${notes.trim()}` : ''}`
        : (notes.trim() || '-');

    const newOrder: Order = {
      id: generateTransactionId(),
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      pickupMethod,
      notes: finalNotes,
      items: items.map((item) => {
        const cleanFlavor =
          item.selectedFlavor === 'Milo' ? 'Coklat' : item.selectedFlavor;
        return {
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedFlavor: cleanFlavor,
          subtotal: item.product.price * item.quantity,
        };
      }),
      totalPrice,
      totalItems,
      status: 'Menunggu konfirmasi',
      createdAt: new Date().toISOString(),
      scheduledDate: allocation.scheduledDate,
      scheduledDayIndex: selectedDayIndex,
      dailyOrderNumber: allocation.dailyOrderNumber,
      isRollover: false,
    };

    // Save to Cloud & Local Store via orderService
    await orderService.createOrder(newOrder);

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
    setIsSubmitting(false);
    addToast('Pesanan berhasil dibuat & tersimpan di sistem kasir stand!', 'success');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda / Menu</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-heading font-black border border-sky-200">
              01
            </div>
            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-800">
                Formulir Pemesanan
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pilih tanggal pengambilan dan lengkapi data pemesan di bawah ini.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pilihan Jadwal Pengambilan 3 Hari */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Pilih Tanggal Pengambilan Stand (27 s/d 29 Nov 2026) *</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Target: 25 Pcs/Menu (125 Porsi/Hari)
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {daySummaries.map((day) => {
                  const isSelected = selectedDayIndex === day.dayIndex;
                  const isLocked = !day.isUnlocked && !day.isFull;
                  const isDisabled = day.isFull || isLocked;
                  return (
                    <button
                      key={day.dayIndex}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setSelectedDayIndex(day.dayIndex)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative min-h-[86px] flex flex-col justify-between ${
                        isDisabled
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-sky-50/90 border-[#0284C7] ring-2 ring-[#0284C7] shadow-sm hover:-translate-y-0.5'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-heading font-bold text-[#0284C7] uppercase">
                          {day.dayLabel}
                        </span>
                        {day.isFull ? (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Penuh
                          </span>
                        ) : isLocked ? (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Terkunci</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-600">
                            {day.totalSoldPcs}/125 porsi
                          </span>
                        )}
                      </div>

                      <div className="font-heading font-black text-xs sm:text-sm text-slate-800 mt-1">
                        {day.dateShort} 2026
                      </div>

                      {isLocked ? (
                        <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                          Terbuka jika Hari ke-{day.dayIndex - 1} penuh 125 produk
                        </p>
                      ) : (
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              day.isFull ? 'bg-rose-500' : 'bg-[#0284C7]'
                            }`}
                            style={{ width: `${day.percentage}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Warning if selected day quota is exceeded for any cart item */}
              {!availability.isAvailable && items.length > 0 && (
                <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-heading font-black block text-amber-900">
                        {availability.isDayLocked
                          ? '⚠️ Jadwal Belum Terbuka (Aturan Penjualan Sekuensial)'
                          : '⚠️ Kuota Menu Terpenuhi untuk Hari Ini (Maksimal 25 Pcs/Menu)'}
                      </span>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        {availability.isDayLocked
                          ? availability.lockedReason
                          : availability.exceededProducts.length > 0
                          ? `Menu ${availability.exceededProducts
                              .map((p) => `${p.name} (tersisa ${p.remaining} pcs)`)
                              .join(', ')} telah mencapai batas target 25 pcs per hari.`
                          : 'Kapasitas maksimal 125 porsi untuk hari ini telah penuh.'}
                      </p>
                    </div>

                    {availability.recommendedDayIndex !== selectedDayIndex && (
                      <button
                        type="button"
                        onClick={() => setSelectedDayIndex(availability.recommendedDayIndex)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-xs whitespace-nowrap transition-all shadow-xs self-end sm:self-center hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Pindah ke Hari {availability.recommendedDayIndex} →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Status info chosen day */}
              <div className="mt-2.5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span className="text-slate-700 font-medium">
                    Jadwal Terpilih: <strong>{allocation.scheduledDate}</strong>
                  </span>
                </div>
                <span className="font-heading font-bold text-[#0284C7] text-[11px]">
                  Terisi {daySummaries.find((d) => d.dayIndex === selectedDayIndex)?.totalSoldPcs || 0} / 125 Pcs
                </span>
              </div>
            </div>

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

            {/* Metode Pengambilan & Pengiriman Pesanan */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Pilihan Metode Pengambilan / Pengiriman *</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Lumajang Kota Free Delivery
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Opsi 1: Ambil di Stand 12B */}
                <button
                  type="button"
                  onClick={() => setPickupMethod('Ambil di Stand 12B')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    pickupMethod === 'Ambil di Stand 12B'
                      ? 'bg-sky-50/90 border-[#0284C7] ring-2 ring-[#0284C7] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-[#0284C7]">
                        <Store className="w-3 h-3" />
                        <span>AMBIL LANGSUNG</span>
                      </span>
                      {pickupMethod === 'Ambil di Stand 12B' && (
                        <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                      )}
                    </div>
                    <div className="font-heading font-black text-sm text-slate-900">
                      Ambil di Stand 12B
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                      Ambil langsung di Stand Kelas 12B ({BRAND_INFO.standLocation}) saat jam buka 07:00 WIB.
                    </p>
                  </div>
                </button>

                {/* Opsi 2: Diantar di Lumajang Kota */}
                <button
                  type="button"
                  onClick={() => setPickupMethod('Diantar di Lumajang Kota (Free Delivery)')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    pickupMethod === 'Diantar di Lumajang Kota (Free Delivery)'
                      ? 'bg-sky-50/90 border-[#0284C7] ring-2 ring-[#0284C7] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        <Truck className="w-3 h-3" />
                        <span>GRATIS ONGKIR</span>
                      </span>
                      {pickupMethod === 'Diantar di Lumajang Kota (Free Delivery)' && (
                        <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                      )}
                    </div>
                    <div className="font-heading font-black text-sm text-slate-900">
                      Diantar di Lumajang Kota
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                      Free delivery! Pesanan diantar langsung ke rumah, sekolah, atau kantormu di wilayah Lumajang Kota.
                    </p>
                  </div>
                </button>
              </div>

              {/* Input Alamat Khusus Pengantaran Lumajang Kota */}
              {pickupMethod === 'Diantar di Lumajang Kota (Free Delivery)' && (
                <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5 animate-in fade-in duration-200">
                  <label className="block text-xs font-heading font-bold text-emerald-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Alamat / Lokasi Pengantaran di Lumajang Kota *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Contoh: Jl. Panjaitan No. 45 / Gedung X Ruang 3, Lumajang"
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <p className="text-[10px] text-emerald-700 font-medium">
                    *Fasilitas Free Delivery khusus Lumajang Kota. Pastikan nomor WhatsApp aktif untuk koordinasi kurir.
                  </p>
                </div>
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
                disabled={items.length === 0 || isSubmitting || allocation.isFull}
                className="w-full py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-heading font-black rounded-full shadow-btn-sky transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan Pesanan...' : 'Buat Struk & Kirim via WhatsApp'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                *Pesanan otomatis tersimpan di kasir stand & diarahkan ke WhatsApp Admin Nisrina (0858-4378-8915)
              </p>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-card-paper border border-sky-100">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-heading font-black text-base text-slate-800">
              Ringkasan Pesanan
            </h3>
            <span className="font-heading font-bold text-xs px-2.5 py-0.5 bg-sky-50 text-[#0284C7] rounded-full border border-sky-100">
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
                className="mt-3 inline-block px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-heading font-bold rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0"
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
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800">
                        {item.product.name}
                        {item.selectedFlavor && ` (${item.selectedFlavor})`}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {formatRupiah(item.product.price)} x {item.quantity} pcs
                      </p>
                    </div>
                    <span className="font-heading font-black text-xs sm:text-sm text-[#0284C7]">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Produk</span>
                  <span className="font-heading font-bold">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Biaya Pengantaran</span>
                  <span className="font-heading font-bold text-[#0284C7]">GRATIS</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Jadwal Pengambilan</span>
                  <span className="font-heading font-bold text-slate-800">{allocation.scheduledDate}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-heading font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Pembayaran</span>
                  <span className="font-heading font-black text-lg text-[#0284C7]">
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
