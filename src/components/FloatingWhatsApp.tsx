'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <a
        href={BRAND_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-full shadow-2xl border-2 border-white/80 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 min-h-[48px]"
        aria-label="Hubungi Admin Nisrina via WhatsApp"
        title="Chat WhatsApp Admin Nisrina"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#0284C7] flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-4 h-4 fill-current" />
        </div>
        <div className="text-left hidden sm:block pr-1">
          <div className="text-[10px] font-mono font-bold text-sky-100 uppercase tracking-wider">
            Tanya Stand
          </div>
          <div className="text-xs font-black text-white">
            Nisrina (WA)
          </div>
        </div>
      </a>
    </aside>
  );
};
