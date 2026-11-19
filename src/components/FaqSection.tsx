'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Kapan dan di mana stand BINARY.BITE beroperasi?',
      answer: `Stand BINARY.BITE resmi beroperasi pada ${BRAND_INFO.eventDateText} mulai pukul 07:00 WIB hingga selesai, berlokasi di ${BRAND_INFO.standLocation}.`,
    },
    {
      question: 'Apakah saya bisa melakukan pemesanan lebih awal (Pre-Order)?',
      answer:
        'Sangat disarankan! Dengan melakukan pemesanan sekarang melalui website ini dan konfirmasi via WhatsApp ke Admin Nisrina, porsi menu pilihanmu sudah terjamin aman dan tidak akan kehabisan saat acara berlangsung.',
    },
    {
      question: 'Bagaimana metode pengambilan pesanan?',
      answer:
        `Metode pengambilan pesanan dilayani khusus area "Lumajang Kota". Lokasi stand resmi berada di ${BRAND_INFO.standLocation}. Anda dapat mengambil pesanan langsung di stand atau berkoordinasi via WhatsApp Admin saat pesanan siap.`,
    },
    {
      question: 'Metode pembayaran apa saja yang didukung?',
      answer:
        'Kami menerima pembayaran tunai (cash) langsung di stand kasir 12B saat pengambilan, serta transfer bank / QRIS digital saat konfirmasi melalui WhatsApp Admin.',
    },
    {
      question: 'Berapa batas kuota pesanan per hari?',
      answer:
        'Kami menetapkan kapasitas target 25 pesanan per hari untuk memastikan setiap olahan makanan dan minuman disajikan dalam kondisi segar berkualitas tinggi. Jika pesanan pada suatu hari telah mencapai kuota 25 pesanan, pesanan berikutnya secara otomatis dialokasikan untuk disiapkan pada hari selanjutnya.',
    },
    {
      question: 'Bagaimana cara mendapatkan struk fisik atau digital?',
      answer:
        'Setelah melakukan pemesanan di website ini, struk thermal digital langsung dibuat secara otomatis. Kamu bisa mengunduh file PDF atau mencetaknya langsung sebagai bukti pemesanan.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-brand-sky border-b-2 border-brand-cobalt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-white border border-brand-royal rounded-md text-xs font-mono font-bold text-brand-cobalt mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-electric" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-cobalt tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm sm:text-base text-brand-slate font-medium mt-1">
            Informasi lengkap seputar pemesanan, lokasi stand, dan teknis acara.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-brand-white border-2 border-brand-cobalt rounded-xl overflow-hidden shadow-flat-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-brand-cobalt hover:bg-brand-sky/40 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-brand-royal">
                      0{idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-brand-sky border border-brand-royal flex items-center justify-center text-brand-cobalt flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-slate leading-relaxed border-t border-brand-line bg-brand-white animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

