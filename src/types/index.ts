export type ProductCategory = 'Semua' | 'Makanan' | 'Minuman';

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  badge: string;
  description: string;
  image: string;
  alt: string;
  isPopular?: boolean;
  flavors?: string[];
  flavorImages?: { [flavor: string]: string };
}

export interface CartItem {
  id: string; // product.id or product.id + flavor
  product: Product;
  quantity: number;
  selectedFlavor?: string;
}

export type OrderStatus =
  | 'Menunggu konfirmasi'
  | 'Diproses'
  | 'Siap diambil'
  | 'Selesai'
  | 'Dibatalkan';

export type PaymentMethod = 'Tunai' | 'QRIS';

export type PaymentStatus =
  | 'Belum dibayar'
  | 'Menunggu verifikasi'
  | 'Lunas'
  | 'Dibatalkan'
  | 'Kedaluwarsa';

export type PickupMethod =
  | 'Ambil di Stand 12B'
  | 'Diantar di Lumajang Kota (Free Delivery)'
  | 'Lumajang Kota'
  | 'Stand Langsung';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedFlavor?: string;
  subtotal: number;
}

export interface Order {
  id: string; // Format: BB-20261127-XXXX
  customerName: string;
  customerContact: string; // Kelas / No WhatsApp
  pickupMethod: PickupMethod;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentProof?: string; // Base64 data URL
  paymentProofName?: string;
  qrisExpiresAt?: string;
  notes: string;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: string;
  scheduledDate?: string;
  scheduledDayIndex?: number;
  dailyOrderNumber?: number;
  isRollover?: boolean;
}

