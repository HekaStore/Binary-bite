'use client';

import React from 'react';
import { Sparkles, Utensils, Heart, Check, Users, Award } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-20 sm:py-28 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text: Origin Story & Principles */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-semibold text-[#0284C7]">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>TENTANG KAMI • KELAS 12B</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              Kombinasi Presisi Digital dan Cita Rasa Kuliner Pilihan
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Nama <strong>BINARY.BITE</strong> lahir dari kolaborasi semangat kewirausahaan siswa-siswi <strong>Kelas 12B</strong> dalam menghadirkan festival kuliner yang profesional, lezat, dan higienis:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3.5 hover:-translate-y-0.5 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-heading font-black text-xs flex-shrink-0 shadow-sm">
                  01
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-slate-900">
                    "BINARY": Presisi Digital & Layanan Cepat
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sistem pemesanan modern yang transparan, ID transaksi otomatis, struk digital thermal, serta rekapitulasi data pesanan secara akurat.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 flex items-start gap-3.5 hover:-translate-y-0.5 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-[#0369A1] text-white flex items-center justify-center font-heading font-black text-xs flex-shrink-0 shadow-sm">
                  02
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-slate-900">
                    "BITE": Kelezatan di Setiap Gigitan
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Keaslian cita rasa pada 5 menu unggulan buatan sendiri: Kue Lipat lumer, Sus Buah segar, Roll Abon gurih, Es Gabin dingin, serta Es Capcin yang creamy.
                  </p>
                </div>
              </div>
            </div>

            {/* Stand Facts (Rule 9: Street & District only) */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <Check className="w-4 h-4 text-[#0284C7]" />
                <span>Kelas 12B Official</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <Check className="w-4 h-4 text-[#0284C7]" />
                <span>Jl. AR Hakim, Ditotrunan</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <Check className="w-4 h-4 text-[#0284C7]" />
                <span>27 s/d 29 November 2026</span>
              </div>
            </div>
          </div>

          {/* Right Visual: Stand Photo & Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-5 shadow-card-paper border border-sky-100 relative overflow-hidden group hover:-translate-y-0.5 transition-all">
              {/* Top Badge */}
              <div className="absolute top-0 right-0 bg-[#0284C7] text-white px-3.5 py-1 rounded-bl-2xl text-[10px] font-heading font-black tracking-wider">
                DOKUMENTASI STAND
              </div>

              {/* Real Stand Photo (Rule 6: More and better real photographs) */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-sky-50 border border-slate-200">
                <img
                  src="/images/stand-menu.jpg"
                  alt="Poster Menu Stand Resmi BINARY.BITE Kelas 12B"
                  className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* PKWU Program Note */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 mb-1 text-[#0284C7]">
                  <Award className="w-4 h-4" />
                  <h4 className="font-heading font-black text-xs sm:text-sm text-slate-800">
                    Proyek Prakarya & Kewirausahaan (PKWU)
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Dirancang dan diproduksi mandiri oleh seluruh siswa-siswi Kelas 12B sebagai implementasi nyata tata kelola usaha kuliner modern dan efisien.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
