'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

export const CountdownSection: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const targetTime = new Date(BRAND_INFO.targetDateTime).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBoxes = [
    { label: 'HARI', value: isMounted ? String(timeLeft.days).padStart(2, '0') : '--' },
    { label: 'JAM', value: isMounted ? String(timeLeft.hours).padStart(2, '0') : '--' },
    { label: 'MENIT', value: isMounted ? String(timeLeft.minutes).padStart(2, '0') : '--' },
    { label: 'DETIK', value: isMounted ? String(timeLeft.seconds).padStart(2, '0') : '--' },
  ];

  return (
    <section className="bg-[#0284C7] relative overflow-hidden py-16 sm:py-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="text-center lg:text-left text-white max-w-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-sky-100 mb-3 border border-white/30">
              <Calendar className="w-3.5 h-3.5 text-sky-200" />
              <span>{BRAND_INFO.eventDateText} • 07:00 WIB</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl tracking-tight uppercase">
              {timeLeft.isOver ? 'EVENT TELAH DIMULAI!' : 'HITUNG MUNDUR BUKA STAND'}
            </h2>
            <p className="text-sm text-sky-100 font-medium mt-1 leading-relaxed">
              {timeLeft.isOver
                ? 'Stand 12B sudah siap melayani! Segera kunjungi stand kami di Jl. AR Hakim, Ditotrunan, Lumajang.'
                : 'Pesan sekarang untuk memastikan porsi menu favoritmu sebelum kehabisan saat acara berlangsung.'}
            </p>
          </div>

          {/* Right: Digital Folded Cards */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {timeBoxes.map((box, idx) => (
              <div key={box.label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 sm:w-24 sm:h-28 bg-white rounded-2xl flex flex-col items-center justify-center shadow-soft-float border border-sky-100 relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
                    {/* Top colored line */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-[#0284C7]" />
                    <span className="font-heading font-black text-2xl sm:text-4xl text-slate-800 tracking-tight">
                      {box.value}
                    </span>
                    <span className="font-heading font-bold text-[9px] sm:text-[11px] text-[#0284C7] uppercase mt-1 tracking-wider">
                      {box.label}
                    </span>
                  </div>
                </div>
                {idx < timeBoxes.length - 1 && (
                  <span className="font-heading text-xl sm:text-2xl font-black text-white/80 -mt-5">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
