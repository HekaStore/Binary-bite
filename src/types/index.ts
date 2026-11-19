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

export type PickupMethod = 'Ambil di Stand 12B' | 'Antar Area Sekolah';

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
  notes: string;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: string;
}

