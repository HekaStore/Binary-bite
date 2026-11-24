'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { BRAND_INFO } from '@/data/products';
import { formatRupiah, createWhatsAppOrderUrl } from '@/utils/formatters';
import { jsPDF } from 'jspdf';
import { Printer, Download, Share2, MessageCircle, X, Check, Copy } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');
  const [copied, setCopied] = useState(false);

  // Print thermal receipt using window.print()
  const handlePrint = () => {
    window.print();
  };

  // Generate and download PDF using jsPDF
  const handleDownloadPdf = () => {
    const is58 = paperWidth === '58mm';
    const pdfWidth = is58 ? 58 : 80;
    // Calculate required height based on items
    const baseHeight = 120;
    const dynamicHeight = baseHeight + order.items.length * 12;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, dynamicHeight],
    });

    const leftMargin = is58 ? 4 : 6;
    const rightMargin = is58 ? 54 : 74;
    const centerPos = is58 ? 29 : 40;
    let y = 10;

    doc.setFont('courier', 'bold');
    doc.setFontSize(is58 ? 11 : 13);
    doc.text(BRAND_INFO.name, centerPos, y, { align: 'center' });

    y += 5;
    doc.setFontSize(is58 ? 7 : 8);
    doc.setFont('courier', 'normal');
    doc.text(BRAND_INFO.tagline, centerPos, y, { align: 'center' });

    y += 4;
    doc.text(`Stand: ${BRAND_INFO.fullName}`, centerPos, y, { align: 'center' });

    y += 4;
    doc.text(`Admin: ${BRAND_INFO.adminName} (${BRAND_INFO.whatsappRaw})`, centerPos, y, { align: 'center' });

    y += 4;
    doc.text('------------------------------------------'.slice(0, is58 ? 28 : 38), centerPos, y, { align: 'center' });

    y += 5;
    doc.setFontSize(is58 ? 7 : 8);
    doc.text(`No. Trx : ${order.id}`, leftMargin, y);
    y += 4;
    doc.text(`Jadwal  : ${order.scheduledDate || BRAND_INFO.eventDateText}`, leftMargin, y);
    y += 4;
    doc.text(`Kuota   : Hari ke-${order.scheduledDayIndex || 1} (Kapasitas 375 pcs/hari)`, leftMargin, y);
    if (order.isRollover) {
      y += 4;
      doc.text(`*Dialihkan ke hari selanjutnya`, leftMargin, y);
    }
    y += 4;
    doc.text(`Nama    : ${order.customerName}`, leftMargin, y);
    y += 4;
    doc.text(`Kontak  : ${order.customerContact}`, leftMargin, y);
    y += 4;
    doc.text(`Ambil   : ${order.pickupMethod}`, leftMargin, y);
    y += 4;
    doc.text(`Bayar   : ${order.paymentMethod || 'Tunai'}${order.paymentMethod === 'QRIS' ? ' (Aurea)' : ''}`, leftMargin, y);

    y += 4;
    doc.text('------------------------------------------'.slice(0, is58 ? 28 : 38), centerPos, y, { align: 'center' });

    y += 5;
    doc.setFont('courier', 'bold');
    doc.text('DAFTAR PESANAN:', leftMargin, y);
    doc.setFont('courier', 'normal');

    order.items.forEach((item) => {
      y += 5;
      const cleanFlavor = item.selectedFlavor === 'Milo' ? 'Coklat' : item.selectedFlavor;
      const flavorStr = cleanFlavor ? ` (${cleanFlavor})` : '';
      doc.text(`${item.name}${flavorStr}`, leftMargin, y);
      y += 4;
      const calcStr = `${formatRupiah(item.price)} x ${item.quantity} pcs`;
      doc.text(calcStr, leftMargin + 2, y);
      doc.text(formatRupiah(item.subtotal), rightMargin, y, { align: 'right' });
    });

    y += 5;
    doc.text('------------------------------------------'.slice(0, is58 ? 28 : 38), centerPos, y, { align: 'center' });

    y += 5;
    doc.setFont('courier', 'bold');
    doc.setFontSize(is58 ? 9 : 10);
    doc.text('TOTAL :', leftMargin, y);
    doc.text(formatRupiah(order.totalPrice), rightMargin, y, { align: 'right' });

    y += 5;
    doc.setFontSize(is58 ? 7 : 8);
    doc.setFont('courier', 'normal');
    doc.text(`Status  : ${order.status.toUpperCase()}`, leftMargin, y);

    if (order.notes && order.notes !== '-') {
      y += 4;
      doc.text(`Catatan : ${order.notes}`, leftMargin, y);
    }

    y += 6;
    doc.text('Terima kasih atas pesanan Anda!', centerPos, y, { align: 'center' });
    y += 4;
    doc.text('ONE BITE, ENDLESS HAPPINESS!', centerPos, y, { align: 'center' });

    doc.save(`Struk-${order.id}.pdf`);
  };

  const handleCopyText = () => {
    const waUrl = createWhatsAppOrderUrl(order);
    navigator.clipboard.writeText(decodeURIComponent(waUrl.split('text=')[1] || ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate/80 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 print:border-none print:shadow-none print:p-0 print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-line print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-electric" />
            <h4 className="font-extrabold text-base text-brand-cobalt">
              Struk Digital BINARY.BITE
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {/* Paper width toggle */}
            <div className="flex bg-brand-sky border border-brand-royal rounded-lg p-0.5 text-xs font-mono font-bold">
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-2 py-1 rounded ${
                  paperWidth === '58mm' ? 'bg-brand-cobalt text-brand-white' : 'text-brand-cobalt'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-2 py-1 rounded ${
                  paperWidth === '80mm' ? 'bg-brand-cobalt text-brand-white' : 'text-brand-cobalt'
                }`}
              >
                80mm
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-brand-slate hover:bg-brand-sky rounded-lg"
              aria-label="Tutup struk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Layout */}
        <div
          className={`mx-auto bg-white border-2 border-dashed border-brand-cobalt p-5 font-mono text-brand-slate transition-all ${
            paperWidth === '58mm' ? 'max-w-[320px]' : 'max-w-[420px]'
          } print:max-w-none print:border-none print:p-2`}
        >
          {/* Receipt Header */}
          <div className="text-center pb-3 border-b border-dashed border-brand-cobalt">
            <h3 className="text-lg font-black tracking-wider text-brand-cobalt">
              {BRAND_INFO.name}
            </h3>
            <p className="text-[11px] font-bold text-brand-royal uppercase">
              {BRAND_INFO.tagline}
            </p>
            <p className="text-[10px] text-brand-muted mt-0.5">
              Stand: {BRAND_INFO.fullName}
            </p>
            <p className="text-[10px] text-brand-muted">
              Admin: {BRAND_INFO.adminName} ({BRAND_INFO.whatsappRaw})
            </p>
          </div>

          {/* Transaction Metadata */}
          <div className="py-2.5 border-b border-dashed border-brand-cobalt text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-brand-muted">No. Trx:</span>
              <span className="font-bold text-brand-cobalt">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Jadwal:</span>
              <span className="font-bold text-brand-cobalt">
                {order.scheduledDate || BRAND_INFO.eventDateText}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Kuota:</span>
              <span className="font-semibold text-brand-cobalt">
                Hari ke-{order.scheduledDayIndex || 1} (Kapasitas 375 pcs/hari)
              </span>
            </div>
            {order.isRollover && (
              <div className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded border border-amber-200">
                *Dialihkan ke hari selanjutnya (kuota menu / harian terpenuhi)
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-brand-muted">Pelanggan:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Kontak:</span>
              <span>{order.customerContact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Metode:</span>
              <span className="font-semibold text-brand-royal">{order.pickupMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Pembayaran:</span>
              <span className={`font-bold ${order.paymentMethod === 'QRIS' ? 'text-indigo-600' : 'text-slate-800'}`}>
                {order.paymentMethod || 'Tunai'} {order.paymentMethod === 'QRIS' ? '(QRIS Aurea)' : ''}
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="py-2.5 border-b border-dashed border-brand-cobalt text-xs space-y-2">
            <div className="text-[10px] font-bold text-brand-muted uppercase">
              DAFTAR PEMBELIAN:
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-bold text-brand-cobalt">
                  {item.name}
                  {item.selectedFlavor &&
                    ` (${item.selectedFlavor === 'Milo' ? 'Coklat' : item.selectedFlavor})`}
                </div>
                <div className="flex justify-between text-brand-muted text-[11px]">
                  <span>
                    {formatRupiah(item.price)} x {item.quantity} pcs
                  </span>
                  <span className="font-bold text-brand-slate">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Status */}
          <div className="py-2.5 border-b border-dashed border-brand-cobalt text-xs space-y-1.5">
            <div className="flex justify-between text-sm font-black text-brand-cobalt">
              <span>TOTAL PEMBAYARAN:</span>
              <span className="text-base text-brand-electric">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-brand-muted">Status Pesanan:</span>
              <span className="px-1.5 py-0.5 bg-brand-sky text-brand-cobalt font-bold rounded border border-brand-royal">
                {order.status.toUpperCase()}
              </span>
            </div>
            {order.notes && order.notes !== '-' && (
              <div className="text-[11px] pt-1">
                <span className="text-brand-muted">Catatan: </span>
                <span className="italic">{order.notes}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 text-[10px] text-brand-muted space-y-0.5">
            <p className="font-semibold text-brand-cobalt">
              Terima kasih telah memesan di BINARY.BITE!
            </p>
            <p>Simpan struk ini sebagai bukti pemesanan.</p>
          </div>
        </div>

        {/* Action Buttons (Print, PDF, WhatsApp, Copy) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-brand-line print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-white border-2 border-brand-royal rounded-xl text-xs font-bold text-brand-cobalt hover:bg-brand-sky transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Thermal</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-white border-2 border-brand-royal rounded-xl text-xs font-bold text-brand-cobalt hover:bg-brand-sky transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-white border-2 border-brand-royal rounded-xl text-xs font-bold text-brand-cobalt hover:bg-brand-sky transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <a
            href={createWhatsAppOrderUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-cobalt text-brand-white rounded-xl text-xs font-bold hover:bg-brand-royal shadow-solid-electric transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ke WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

