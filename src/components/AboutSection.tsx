'use client';

import React from 'react';
import { Terminal, Code, Sparkles, Coffee, Heart, Check } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-16 sm:py-24 bg-brand-white border-b-2 border-brand-cobalt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-sky border border-brand-royal rounded-md text-xs font-mono font-bold text-brand-cobalt">
              <Code className="w-3.5 h-3.5 text-brand-electric" />
              <span>TENTANG BINARY.BITE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-cobalt tracking-tight leading-tight">
              Kombinasi Presisi Digital dan Cita Rasa Kuliner Modern
            </h2>

            <p className="text-sm sm:text-base text-brand-slate leading-relaxed font-medium">
              Nama <strong>BINARY.BITE</strong> lahir dari kolaborasi semangat siswa-siswi <strong>Kelas 12B</strong> dalam menghadirkan pengalaman festival kuliner yang berbeda:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-brand-sky border border-brand-royal rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-cobalt text-brand-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  01
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-brand-cobalt">
                    "BINARY" — Presisi Digital & Layanan Cepat
                  </h4>
                  <p className="text-xs text-brand-slate mt-0.5">
                    Melambangkan sistem pemesanan modern yang transparan, nomor transaksi otomatis, struk digital, dan kemudahan transaksi berbasis teknologi.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-brand-white border-2 border-brand-cobalt rounded-xl flex items-start gap-3 shadow-flat-sm">
                <div className="w-8 h-8 rounded-lg bg-brand-royal text-brand-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  02
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-brand-cobalt">
                    "BITE" — Kelezatan di Setiap Gigitan
                  </h4>
                  <p className="text-xs text-brand-slate mt-0.5">
                    Melambangkan cita rasa autentik pada 5 menu unggulan: Kue Lipat lumer, Sus Buah segar, Roll Abon gurih, Es Gabin dingin, serta Es Capcin creamy yang menyegarkan.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono font-bold text-brand-cobalt">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-electric" />
                <span>Kelas 12B Official</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-electric" />
                <span>Stand Lapangan Utama</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-electric" />
                <span>27 November 2026</span>
              </div>
            </div>
          </div>

          {/* Right Visual Box */}
          <div className="lg:col-span-5">
            <div className="bg-brand-sky border-2 border-brand-cobalt rounded-2xl p-6 shadow-solid-cobalt">
              {/* Terminal Code Box */}
              <div className="bg-brand-cobalt text-brand-white rounded-xl p-4 font-mono text-xs border border-brand-royal space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-brand-royal/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] text-brand-sky font-bold">binary-bite.config.ts</span>
                </div>
                <div className="space-y-1 text-brand-sky/90 text-[11px] pt-1">
                  <div><span className="text-amber-400">const</span> brand = <span className="text-green-300">"BINARY.BITE"</span>;</div>
                  <div><span className="text-amber-400">const</span> schoolClass = <span className="text-green-300">"12B"</span>;</div>
                  <div><span className="text-amber-400">const</span> eventDate = <span className="text-green-300">"2026-11-27"</span>;</div>
                  <div><span className="text-amber-400">const</span> products = [<span className="text-green-300">"Kue Lipat"</span>, <span className="text-green-300">"Sus Buah"</span>, <span className="text-green-300">"Roll Abon"</span>, <span className="text-green-300">"Es Gabin"</span>, <span className="text-green-300">"Es Capcin"</span>];</div>
                  <div><span className="text-amber-400">const</span> happiness = <span className="text-blue-300">Infinity</span>;</div>
                  <div className="pt-2 text-brand-white font-bold">// Output: ONE BITE, ENDLESS HAPPINESS!</div>
                </div>
              </div>

              {/* Info banner */}
              <div className="mt-4 p-4 bg-brand-white border border-brand-royal rounded-xl">
                <h4 className="font-extrabold text-sm text-brand-cobalt mb-1">
                  Prakarya & Kewirausahaan (PKWU)
                </h4>
                <p className="text-xs text-brand-slate leading-relaxed">
                  Proyek ini merupakan bukti nyata kreativitas siswa dalam mengintegrasikan strategi bisnis kuliner dengan solusi digital e-commerce dan kasir modern.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

