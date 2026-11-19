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
      // Event Target: 27 November 2026 07:00:00 WIB (UTC+7)
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
    <section className="bg-brand-sky border-y-2 border-brand-cobalt py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Header text */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-white border border-brand-royal rounded-full text-xs font-mono font-bold text-brand-cobalt mb-3">
              <Calendar className="w-3.5 h-3.5 text-brand-electric" />
              <span>{BRAND_INFO.eventDateText} • 07:00 WIB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-cobalt tracking-tight">
              {timeLeft.isOver ? 'EVENT TELAH DIMULAI!' : 'HITUNG MUNDUR BUKA STAND'}
            </h2>
            <p className="text-sm text-brand-slate font-medium mt-1">
              {timeLeft.isOver
                ? 'Stand 12B sudah buka! Silakan kunjungi stand kami atau pesan via online.'
                : 'Jangan sampai kehabisan menu favoritmu! Pesan lebih awal untuk jaminan porsi.'}
            </p>
          </div>

          {/* Digital Timer Boxes */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {timeBoxes.map((box, idx) => (
              <div key={box.label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 bg-brand-white border-2 border-brand-cobalt rounded-xl flex items-center justify-center shadow-solid-cobalt">
                    <span className="font-mono text-2xl sm:text-4xl font-extrabold text-brand-cobalt tracking-tight">
                      {box.value}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-brand-royal uppercase mt-2 tracking-wider">
                    {box.label}
                  </span>
                </div>
                {idx < timeBoxes.length - 1 && (
                  <span className="font-mono text-xl sm:text-2xl font-bold text-brand-royal -mt-6">
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

