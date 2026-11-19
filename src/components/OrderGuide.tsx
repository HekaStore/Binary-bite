'use client';

import React from 'react';
import { ShoppingBag, FileText, Send, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const OrderGuide: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Pilih Menu Favorit',
      desc: 'Pilih dari 5 menu lezat resmi kelas 12B.',
      icon: ShoppingBag,
    },
    {
      num: '2',
      title: 'Isi Data Pemesan',
      desc: 'Masukkan nama, kelas, dan metode pengambilan.',
      icon: FileText,
    },
    {
      num: '3',
      title: 'Kirim ke WhatsApp',
      desc: 'Struk otomatis terkirim langsung ke Admin Nisrina.',
      icon: Send,
    },
    {
      num: '4',
      title: 'Ambil & Nikmati',
      desc: 'Ambil pesanan di stand Lumajang Kota.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="cara-pemesanan" className="py-20 sm:py-28 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-[#0284C7] rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>ALUR PEMESANAN MUDAH</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-800 tracking-tight uppercase">
            Panduan Pemesanan Stand 12B
          </h2>
          <div className="w-12 h-1 bg-[#0284C7] mx-auto mt-2 rounded-full" />
        </div>

        {/* 4-Step Horizontal Timeline Connected by Dashed Arrows */}
        <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative items-start">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center relative group">
                  {/* Icon Badge (Rule 5: lifts 2px) */}
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-sky-100 group-hover:border-[#0284C7] shadow-card-paper flex items-center justify-center text-[#0284C7] mb-4 transition-all duration-300 group-hover:-translate-y-0.5">
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Step Title & Description with Poppins */}
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-800 mb-1">
                    {step.num}. {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>

                  {/* Dashed connector arrow between steps (for desktop) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-4 w-8 text-slate-300 font-bold">
                      <ArrowRight className="w-5 h-5 text-sky-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
