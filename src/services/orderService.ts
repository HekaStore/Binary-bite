import { Order, OrderStatus } from '@/types';

const LOCAL_STORAGE_KEY = 'binary_bite_orders';

export interface FetchOrdersResult {
  orders: Order[];
  source: 'cloud' | 'local';
}

function normalizeOrder(order: Order): Order {
  if (!order || !Array.isArray(order.items)) return order;
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      selectedFlavor:
        item.selectedFlavor === 'Milo' ? 'Coklat' : item.selectedFlavor,
    })),
  };
}

export const orderService = {
  // Fetch all orders from backend with localStorage fallback
  async getOrders(): Promise<FetchOrdersResult> {
    try {
      const res = await fetch('/api/orders', {
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const normalized = data.orders.map(normalizeOrder);
          // Backup to local storage
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
          } catch {}
          return { orders: normalized, source: data.source || 'cloud' };
        }
      }
    } catch (err) {
      console.warn('Network request to /api/orders failed, using local storage fallback:', err);
    }

    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return { orders: parsed.map(normalizeOrder), source: 'local' };
        }
      }
    } catch {}

    return { orders: [], source: 'local' };
  },

  // Save a new order to backend with localStorage backup
  async createOrder(order: Order): Promise<boolean> {
    const cleanOrder = normalizeOrder(order);
    // 1. Always backup to local storage first for resilience
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existing: Order[] = raw ? JSON.parse(raw) : [];
      const updated = [cleanOrder, ...existing.filter((o) => o.id !== cleanOrder.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write order to localStorage:', e);
    }

    // 2. Send to backend /api/orders (which syncs to Cloud / Firebase)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanOrder),
      });

      if (res.ok) {
        const data = await res.json();
        return data.success === true;
      }
    } catch (err) {
      console.warn('Network send to /api/orders failed, saved in local store:', err);
    }

    return true;
  },

  // Update order status
  async updateStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    // 1. Update local storage immediately
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const existing: Order[] = JSON.parse(raw);
        const updated = existing.map((o) => (o.id === orderId ? { ...o, status } : o));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {}

    // 2. Sync to cloud API
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.success === true;
      }
    } catch (err) {
      console.warn('Failed to sync status update to cloud API:', err);
    }

    return true;
  },

  // Update an entire order
  async updateOrder(order: Order): Promise<boolean> {
    const cleanOrder = normalizeOrder(order);

    // 1. Update local storage immediately
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const existing: Order[] = JSON.parse(raw);
        const updated = existing.map((o) => (o.id === cleanOrder.id ? cleanOrder : o));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {}

    // 2. Sync to cloud API
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanOrder),
      });

      if (res.ok) {
        const data = await res.json();
        return data.success === true;
      }
    } catch (err) {
      console.warn('Failed to sync updated order to cloud API:', err);
    }

    return true;
  },

  // Delete a single order (with admin PIN)
  async deleteOrder(orderId: string, pin: string = '2789'): Promise<boolean> {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const existing: Order[] = JSON.parse(raw);
        const updated = existing.filter((o) => o.id !== orderId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(
        `/api/orders?pin=${encodeURIComponent(pin)}&orderId=${encodeURIComponent(orderId)}`,
        { method: 'DELETE' }
      );
      return res.ok;
    } catch {
      return false;
    }
  },

  // Clear all orders (with admin PIN)
  async clearAll(pin: string): Promise<boolean> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}

    try {
      const res = await fetch(`/api/orders?pin=${encodeURIComponent(pin)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
