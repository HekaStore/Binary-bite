'use client';

import React from 'react';
import { ShoppingBag, FileCheck, Send, CheckCircle2 } from 'lucide-react';

export const OrderGuide: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Pilih Menu Favorit',
      desc: 'Pilih dari 5 menu resmi BINARY.BITE (Kue Lipat, Sus Buah, Roll Abon, Es Gabin, atau Es Capcin) dan tambahkan ke keranjang.',
      icon: ShoppingBag,
    },
    {
      num: '02',
      title: 'Isi Data Checkout',
      desc: 'Masukkan nama, kelas/instansi pemesan, serta pilih metode pengambilan (Ambil di Stand 12B atau Antar Area Sekolah).',
      icon: FileCheck,
    },
    {
      num: '03',
      title: 'Kirim via WhatsApp',
      desc: 'Sistem otomatis merangkai format pemesanan resmi beserta nomor transaksi menuju Admin Nisrina (0858-4378-8915).',
      icon: Send,
    },
    {
      num: '04',
      title: 'Ambil & Nikmati!',
      desc: 'Dapatkan struk digitalmu, simpan buktinya, lalu ambil pesanan lezatmu saat hari acara Jumat, 27 November 2026.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="cara-pemesanan" className="py-16 sm:py-24 bg-brand-sky border-b-2 border-brand-cobalt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-brand-white border border-brand-royal rounded-md text-xs font-mono font-bold text-brand-cobalt mb-3">
            PANDUAN PEMESANAN
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-cobalt tracking-tight">
            4 Langkah Mudah Memesan
          </h2>
          <p className="text-sm sm:text-base text-brand-slate font-medium mt-1">
            Alur pemesanan digital cepat, transparan, dan terintegrasi langsung dengan WhatsApp kasir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-6 shadow-flat-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-brand-royal">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-sky border border-brand-royal flex items-center justify-center text-brand-cobalt">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-extrabold text-lg text-brand-cobalt mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

