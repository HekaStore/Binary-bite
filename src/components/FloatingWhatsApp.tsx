'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '@/data/products';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-6 left-6 z-40">
      <a
        href={BRAND_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 bg-brand-cobalt text-brand-white rounded-2xl border-2 border-brand-royal shadow-solid-electric hover:bg-brand-royal active:translate-y-0.5 transition-all"
        aria-label="Hubungi Admin Nisrina via WhatsApp"
      >
        <div className="w-8 h-8 rounded-xl bg-brand-electric flex items-center justify-center text-brand-white">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[10px] font-mono font-bold text-brand-sky uppercase tracking-wider">
            Tanya Admin Stand
          </div>
          <div className="text-xs font-extrabold text-brand-white">
            Nisrina (WA)
          </div>
        </div>
      </a>
    </aside>
  );
};

