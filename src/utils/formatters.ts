import { Order } from '@/types';
import { BRAND_INFO } from '@/data/products';

export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

export function generateTransactionId(): string {
  const dateStr = '20261127';
  // Read existing order count from localStorage if available
  let count = 1;
  if (typeof window !== 'undefined') {
    try {
      const orders = JSON.parse(localStorage.getItem('binary_bite_orders') || '[]');
      count = orders.length + 1;
    } catch {
      count = Math.floor(Math.random() * 900) + 100;
    }
  } else {
    count = Math.floor(Math.random() * 900) + 100;
  }
  const sequence = String(count).padStart(4, '0');
  return `BB-${dateStr}-${sequence}`;
}

export function createWhatsAppOrderUrl(order: Order): string {
  const itemsText = order.items
    .map((item, index) => {
      const flavorText = item.selectedFlavor ? ` (${item.selectedFlavor})` : '';
      return `${index + 1}. ${item.name}${flavorText}\n   Jumlah: ${item.quantity} pcs\n   Subtotal: ${formatRupiah(item.subtotal)}`;
    })
    .join('\n');

  const notesText = order.notes.trim() ? order.notes.trim() : '-';

  const message = `HALO BINARY.BITE!

Saya ingin melakukan pemesanan untuk acara ${BRAND_INFO.eventDateText}.

DETAIL PEMESANAN:
No. Transaksi: ${order.id}
Nama: ${order.customerName}
Kelas / No. WA: ${order.customerContact}
Metode Ambil: ${order.pickupMethod}

DAFTAR PRODUK:
${itemsText}

TOTAL PEMBAYARAN: ${formatRupiah(order.totalPrice)}

Catatan:
${notesText}

Mohon konfirmasi pesanan saya ya Kak ${BRAND_INFO.adminName}.
Terima kasih!
${BRAND_INFO.name} - ${BRAND_INFO.tagline}`;

  return `https://wa.me/${BRAND_INFO.whatsappFormatted}?text=${encodeURIComponent(message)}`;
}

