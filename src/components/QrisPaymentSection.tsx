'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Order } from '@/types';
import { formatRupiah, createWhatsAppOrderUrl } from '@/utils/formatters';
import { BRAND_INFO } from '@/data/products';
import { orderService } from '@/services/orderService';
import { useCart } from '@/context/CartContext';
import { ReceiptModal } from '@/components/ReceiptModal';
import confetti from 'canvas-confetti';
import {
  Clock,
  QrCode,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Trash2,
  Send,
  ShieldCheck,
  FileText,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const QRIS_EXPIRY_SECONDS = 3600; // 1 Jam

export const QrisPaymentSection: React.FC = () => {
  const router = useRouter();
  const { clearCart, addToast } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QRIS_EXPIRY_SECONDS);
  const [proofBase64, setProofBase64] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCopiedAmount, setIsCopiedAmount] = useState<boolean>(false);
  const [isCopiedId, setIsCopiedId] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [finalOrder, setFinalOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Load pending order from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('binary_bite_pending_qris');
      if (!raw) {
        // No pending order, return to checkout
        router.replace('/checkout');
        return;
      }
      const parsedOrder: Order = JSON.parse(raw);
      setOrder(parsedOrder);

      // Check remaining time based on qrisExpiresAt
      if (parsedOrder.qrisExpiresAt) {
        const expiresTime = new Date(parsedOrder.qrisExpiresAt).getTime();
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.floor((expiresTime - now) / 1000));
        setTimeLeft(diffSeconds);
      } else {
        const expiresAt = new Date(Date.now() + QRIS_EXPIRY_SECONDS * 1000).toISOString();
        parsedOrder.qrisExpiresAt = expiresAt;
        localStorage.setItem('binary_bite_pending_qris', JSON.stringify(parsedOrder));
        setTimeLeft(QRIS_EXPIRY_SECONDS);
      }
    } catch (e) {
      console.error('Failed to parse pending QRIS order:', e);
      router.replace('/checkout');
    }
  }, [router]);

  // 2. Countdown Timer (1 Jam)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 3. Handle Copy
  const handleCopyAmount = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.totalPrice.toString());
    setIsCopiedAmount(true);
    addToast('Nominal pembayaran disalin!', 'info');
    setTimeout(() => setIsCopiedAmount(false), 2000);
  };

  const handleCopyId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setIsCopiedId(true);
    addToast('ID Transaksi disalin!', 'info');
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  // 4. Client-side Image Compression & Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 10MB.');
      return;
    }

    setUploadError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.onload = () => {
        // Compress using Canvas to max 1000px dimension and 0.8 JPEG quality
        const canvas = document.createElement('canvas');
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProofBase64(compressedDataUrl);
          setProofFileName(file.name);
          addToast('Foto bukti pembayaran berhasil diunggah!', 'success');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProof = () => {
    setProofBase64('');
    setProofFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 5. Cancel QRIS Payment
  const handleCancelPayment = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan pembayaran QRIS dan kembali ke formulir pemesanan?')) {
      try {
        localStorage.removeItem('binary_bite_pending_qris');
      } catch {}
      addToast('Pembayaran QRIS dibatalkan. Anda dapat memilih metode pembayaran lain.', 'info');
      router.push('/checkout');
    }
  };

  // 6. Submit Payment & Proof
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;

    if (timeLeft <= 0) {
      alert('Waktu pembayaran QRIS telah habis (1 jam). Silakan buat pesanan baru.');
      router.push('/checkout');
      return;
    }

    if (!proofBase64) {
      setUploadError('Silakan unggah foto / tangkapan layar bukti transfer terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    const completedOrder: Order = {
      ...order,
      paymentMethod: 'QRIS',
      paymentStatus: 'Menunggu verifikasi',
      paymentProof: proofBase64,
      paymentProofName: proofFileName || 'bukti-qris.jpg',
      status: 'Menunggu konfirmasi',
      notes: senderName.trim()
        ? `${order.notes ? `${order.notes} • ` : ''}[QRIS a.n. ${senderName.trim()}]`
        : order.notes,
    };

    try {
      // 1. Save directly to Cloud & Local Storage
      await orderService.createOrder(completedOrder);

      // 2. Clear pending QRIS and active cart
      localStorage.removeItem('binary_bite_pending_qris');
      clearCart();

      // 3. Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284C7', '#38BDF8', '#BAE6FD', '#0A2463', '#10B981'],
        });
      } catch {}

      setFinalOrder(completedOrder);
      setIsSuccessModalOpen(true);
      addToast('Bukti pembayaran QRIS berhasil disimpan di sistem kasir stand!', 'success');
    } catch (err) {
      console.error('Error submitting QRIS order:', err);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Handle WhatsApp send
  const handleOpenWhatsApp = () => {
    if (!finalOrder) return;
    const url = createWhatsAppOrderUrl(finalOrder);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!order) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">Memuat halaman pembayaran QRIS...</p>
      </div>
    );
  }

  const isExpired = timeLeft <= 0;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleCancelPayment}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Formulir Pesanan</span>
        </button>

        {/* 1-Hour Countdown Timer Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-mono font-black tracking-tight ${
            isExpired
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : timeLeft < 600
              ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
              : 'bg-sky-50 text-[#0284C7] border-sky-200 shadow-sm'
          }`}
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>
            {isExpired ? 'Waktu Pembayaran Habis' : `Sisa Waktu Bayar: ${formatTimer(timeLeft)}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: QRIS Box & Instructions */}
        <div className="md:col-span-6 space-y-6">
          {/* Card Total Bayar */}
          <div className="bg-white rounded-3xl p-6 shadow-card-paper border border-sky-100">
            <span className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider block">
              Total Pembayaran QRIS
            </span>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
              <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900">
                {formatRupiah(order.totalPrice)}
              </span>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] rounded-xl text-xs font-heading font-bold border border-sky-200 transition-all active:scale-95"
              >
                {isCopiedAmount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedAmount ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">No. Transaksi:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800">{order.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-[#0284C7] transition-colors"
                  title="Salin ID Transaksi"
                >
                  {isCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Clean Pure QRIS Card (Without Red Elements, GPN, or Extra Markings) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100 text-center relative overflow-hidden">
            {/* Soft Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0284C7] rounded-full text-xs font-mono font-bold mb-3 border border-sky-200">
              <QrCode className="w-3.5 h-3.5" />
              <span>QRIS RESMI KASIR KELAS 12B</span>
            </div>

            <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900">
              Aurea
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              NMID: ID1021101566086 • A01
            </p>

            {/* Pure QR Code Display (Clean 100% Black & White) */}
            <div className="my-5 p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm max-w-[280px] sm:max-w-[300px] mx-auto group relative">
              <Image
                src="/images/qris-code.png"
                alt="Kode QRIS Resmi Aurea Binary Bite"
                width={300}
                height={300}
                className="w-full h-auto object-contain rounded-lg"
                priority
              />
            </div>

            {/* Download QR Button for Mobile Users */}
            <a
              href="/images/qris-code.png"
              download="QRIS-BinaryBite-Aurea.png"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-heading font-bold text-xs rounded-full border border-slate-200 shadow-xs transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Unduh Kode QR</span>
            </a>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
              Mendukung seluruh m-Banking & E-Wallet:<br />
              <strong className="text-slate-700">BCA, Mandiri, BRI, BNI, Dana, GoPay, OVO, ShopeePay, LinkAja</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Proof Form & Payment Confirmation */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-heading font-black text-sm border border-sky-200">
                02
              </div>
              <div>
                <h3 className="text-lg font-heading font-black text-slate-900">
                  Kirim Bukti Transaksi
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Unggah tangkapan layar (screenshot) transfer untuk verifikasi kasir stand.
                </p>
              </div>
            </div>

            {uploadError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Foto / Screenshot Bukti Transfer *</span>
                </label>

                {!proofBase64 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-sky-200 hover:border-[#0284C7] bg-sky-50/40 hover:bg-sky-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-sky-200 flex items-center justify-center text-[#0284C7] mx-auto mb-3 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-heading font-bold text-slate-800 block">
                      Klik untuk Pilih Foto Bukti Pembayaran
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                      Format JPG, PNG, atau WEBP (Maksimal 10MB)
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden relative flex-shrink-0 border border-slate-300">
                        <img
                          src={proofBase64}
                          alt="Preview Bukti Transfer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-heading font-bold text-slate-900 block truncate">
                          {proofFileName}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Siap Dikirim</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveProof}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
                      title="Hapus Bukti"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Sender Name Optional Input */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                  Nama Rekening / Akun E-Wallet Pengirim (Opsional)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Contoh: Budi Santoso / Dana 08123xxx"
                  className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0284C7] focus:bg-white transition-all"
                />
              </div>

              {/* Instructions Summary */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-heading font-bold text-slate-700 block">
                  💡 Cara Cepat Bayar:
                </span>
                <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside font-medium leading-relaxed">
                  <li>Scan atau upload QRIS di atas pada aplikasi e-Wallet / m-Banking Anda.</li>
                  <li>Pastikan nama merchant tertera <strong className="text-slate-800">Aurea</strong>.</li>
                  <li>Masukkan nominal pas <strong className="text-[#0284C7] font-mono">{formatRupiah(order.totalPrice)}</strong>.</li>
                  <li>Screenshot struk berhasil dan upload pada form di atas.</li>
                </ol>
              </div>

              {/* Two Action Buttons: Cancel and Bayar/Kirim */}
              <div className="pt-2 space-y-2.5">
                {/* Tombol Bayar / Kirim Bukti */}
                <button
                  type="submit"
                  disabled={!proofBase64 || isSubmitting || isExpired}
                  className="w-full py-3.5 sm:py-4 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-heading font-black rounded-full shadow-btn-sky transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Menyimpan & Memproses...'
                      : 'Kirim Bukti Transaksi & Selesaikan Pesanan'}
                  </span>
                </button>

                {/* Tombol Cancel (Batal Pembayaran QRIS) */}
                <button
                  type="button"
                  onClick={handleCancelPayment}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-rose-600 text-xs font-heading font-bold rounded-full border border-slate-200 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                  <span>Batalkan Metode QRIS (Kembali ke Formulir)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal After Submitting Payment Proof */}
      {isSuccessModalOpen && finalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 text-center relative animate-in zoom-in-95 duration-200">
            {/* Green Badge */}
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Pesanan Sedang Diproses!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
              Bukti pembayaran QRIS telah <strong className="text-slate-800">tersimpan otomatis di sistem kasir Stand 12B</strong> dan sedang diverifikasi oleh admin.
            </p>

            {/* Transaction Card */}
            <div className="my-5 p-4 bg-sky-50/80 rounded-2xl border border-sky-200 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">No. Transaksi:</span>
                <span className="font-mono font-bold text-[#0284C7]">{finalOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Pemesan:</span>
                <span className="font-bold text-slate-800">{finalOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Total Nominal:</span>
                <span className="font-mono font-bold text-slate-900">{formatRupiah(finalOrder.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status Bayar:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                  Menunggu Verifikasi QRIS
                </span>
              </div>
            </div>

            {/* Primary Action: Send Struk & Bukti to WhatsApp Kasir */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm rounded-full shadow-md flex items-center justify-center gap-2 uppercase tracking-wider transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Struk ke WhatsApp Kasir</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-heading font-bold text-xs rounded-full border border-sky-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat & Unduh Struk Digital (PDF)</span>
              </button>

              <Link
                href="/"
                className="block text-center text-xs text-slate-400 hover:text-slate-700 pt-1 font-medium underline"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Struk Modal */}
      {showReceiptModal && finalOrder && (
        <ReceiptModal
          order={finalOrder}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
