import React from 'react';
import { CheckoutSection } from '@/components/CheckoutSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout & Formulir Pemesanan | BINARY.BITE',
  description: 'Konfirmasi pemesanan menu BINARY.BITE Kelas 12B via WhatsApp.',
};

export default function CheckoutPage() {
  return (
    <div className="bg-brand-white min-h-[80vh]">
      <CheckoutSection />
    </div>
  );
}

