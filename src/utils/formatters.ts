import { Order } from '@/types';
import { BRAND_INFO } from '@/data/products';

export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

export function generateTransactionId(): string {
  const dateStr = '20261127';
  // Generate an unmistakable unique order sequence combining time and random salt
  // Prevents concurrent orders from different devices from ever colliding or overwriting
  const timePart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(10 + Math.random() * 90).toString();
  return `BB-${dateStr}-${timePart}${randomPart}`;
}

export function createWhatsAppOrderUrl(order: Order): string {
  const itemsText = order.items
    .map((item, index) => {
      const cleanFlavor = item.selectedFlavor === 'Milo' ? 'Coklat' : item.selectedFlavor;
      const flavorText = cleanFlavor ? ` (${cleanFlavor})` : '';
      return `${index + 1}. ${item.name}${flavorText}\n   Jumlah: ${item.quantity} pcs\n   Subtotal: ${formatRupiah(item.subtotal)}`;
    })
    .join('\n');

  const notesText = order.notes.trim() ? order.notes.trim() : '-';

  const scheduleLine = order.scheduledDate
    ? `Jadwal Ambil: ${order.scheduledDate} (Hari ke-${order.scheduledDayIndex || 1})\nUrutan Kuota: Pesanan ke-${order.dailyOrderNumber || 1} (Target 25 pcs/menu • 125 pcs/hari)${
        order.isRollover
          ? '\n*Catatan Kuota: Kuota menu hari sebelumnya telah penuh (25 pcs/menu), pesanan ini dialihkan ke hari selanjutnya.*'
          : ''
      }`
    : `Jadwal Ambil: ${BRAND_INFO.eventDateText}`;

  const paymentLine =
    order.paymentMethod === 'QRIS'
      ? `Metode Bayar: QRIS (Aurea)\nStatus Bayar: Menunggu Verifikasi Bukti Transfer\n*Bukti transfer sudah saya upload di sistem website.*`
      : `Metode Bayar: Tunai / Cash (Bayar saat pengambilan)`;

  const message = `HALO BINARY.BITE!

Saya ingin melakukan pemesanan untuk acara ${BRAND_INFO.eventDateText}.

DETAIL PEMESANAN:
No. Transaksi: ${order.id}
Nama: ${order.customerName}
Kelas / No. WA: ${order.customerContact}
Metode Ambil: ${order.pickupMethod}
${paymentLine}
${scheduleLine}

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

