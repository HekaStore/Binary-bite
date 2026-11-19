'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-4 bg-brand-white border-2 border-brand-cobalt text-brand-slate shadow-flat-lg rounded-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-brand-electric flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-brand-royal flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-brand-muted hover:text-brand-slate hover:bg-brand-sky rounded-lg transition-colors ml-2"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

