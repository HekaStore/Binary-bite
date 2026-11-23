import React from 'react';
import { QrisPaymentSection } from '@/components/QrisPaymentSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembayaran QRIS | BINARY.BITE Kelas 12B',
  description: 'Selesaikan pembayaran pesanan BINARY.BITE menggunakan QRIS resmi Aurea.',
};

export default function QrisPaymentPage() {
  return (
    <div className="bg-slate-50 min-h-[85vh] py-6 sm:py-10">
      <QrisPaymentSection />
    </div>
  );
}
