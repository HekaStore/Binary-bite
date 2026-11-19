import React from 'react';
import { PosCashier } from '@/components/PosCashier';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POS Kasir & Admin Stand 12B — BINARY.BITE',
  description: 'Sistem POS Kasir dan Manajemen Pesanan Stand BINARY.BITE Kelas 12B.',
};

export default function AdminPage() {
  return (
    <div className="bg-brand-white min-h-[85vh]">
      <PosCashier />
    </div>
  );
}

