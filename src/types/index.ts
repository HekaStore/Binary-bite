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

export type PickupMethod = 'Lumajang Kota' | 'Stand Langsung';

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
  scheduledDate?: string;
  scheduledDayIndex?: number;
  dailyOrderNumber?: number;
  isRollover?: boolean;
}

