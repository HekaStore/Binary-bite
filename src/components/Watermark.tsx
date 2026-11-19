'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export const Watermark: React.FC = () => {
  return (
    <aside
      aria-label="Watermark Developer"
      className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-40 print:hidden pointer-events-auto"
    >
      <a
        href="https://hekaportfolio.web.app/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Website dibuat oleh HekaLabs Studio (Buka Portfolio)"
        title="Dibuat oleh HekaLabs Studio"
        className="group flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-950 text-slate-200 hover:text-white backdrop-blur-md border border-slate-700/60 shadow-lg hover:shadow-sky-500/20 text-[10px] sm:text-[11px] font-medium transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 group-hover:rotate-12 transition-transform flex-shrink-0" />
        <span className="text-slate-400 hidden xs:inline sm:inline">Built by</span>
        <span className="font-bold text-white tracking-tight">HekaLabs Studio</span>
        <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 group-hover:text-sky-300 transition-colors flex-shrink-0" />
      </a>
    </aside>
  );
};
