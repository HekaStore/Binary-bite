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
      answer: `Stand BINARY.BITE resmi beroperasi pada ${BRAND_INFO.eventDateText} mulai pukul 07:00 WIB hingga selesai, bertempat di ${BRAND_INFO.standLocation}.`,
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
    <section id="faq" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-sky-200 rounded-full text-xs font-mono font-bold text-[#0284C7] mb-3 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>PUSAT BANTUAN & TANYA JAWAB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Informasi lengkap seputar pemesanan, lokasi stand, dan teknis acara.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 hover:border-sky-300 rounded-2xl overflow-hidden shadow-sm transition-all hover:-translate-y-0.5"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-800 hover:bg-sky-50/40 transition-colors min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-[#0284C7]">
                      0{idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
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
