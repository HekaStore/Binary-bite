import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/types';
import fs from 'fs';
import path from 'path';

// In-memory cache fallback
let memoryOrders: Order[] = [];

const getDbFilePath = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {}
  }
  return path.join(dataDir, 'orders.json');
};

const getFirebaseUrl = () => {
  return (
    process.env.FIREBASE_DATABASE_URL ||
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://binary-bite-default-rtdb.asia-southeast1.firebasedatabase.app'
  );
};

// Helper to read local orders
const readLocalOrders = (): Order[] => {
  try {
    const filePath = getDbFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryOrders = parsed;
        return memoryOrders;
      }
    }
  } catch (err) {
    console.error('Error reading local orders file:', err);
  }
  return memoryOrders;
};

// Helper to write local orders
const writeLocalOrders = (orders: Order[]) => {
  memoryOrders = orders;
  try {
    const filePath = getDbFilePath();
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local orders file:', err);
  }
};

// GET: Fetch all orders (From Firebase if configured, otherwise local store)
export async function GET() {
  const firebaseUrl = getFirebaseUrl();

  if (firebaseUrl) {
    try {
      const cleanUrl = firebaseUrl.replace(/\/$/, '');
      const res = await fetch(`${cleanUrl}/orders.json`, {
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          // Firebase returns an object of objects keyed by ID or push ID
          const orderList: Order[] = Object.values(data);
          // Sort newest first
          orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return NextResponse.json({ success: true, orders: orderList, source: 'cloud' });
        }
        return NextResponse.json({ success: true, orders: [], source: 'cloud' });
      }
    } catch (err) {
      console.error('Error fetching from Firebase RTDB, falling back to local store:', err);
    }
  }

  // Fallback to local store
  const localOrders = readLocalOrders();
  return NextResponse.json({ success: true, orders: localOrders, source: 'local' });
}

// POST: Save a new order
export async function POST(request: NextRequest) {
  try {
    const newOrder: Order = await request.json();

    if (!newOrder.id || !newOrder.customerName || !newOrder.items) {
      return NextResponse.json(
        { success: false, error: 'Data pesanan tidak lengkap' },
        { status: 400 }
      );
    }

    const firebaseUrl = getFirebaseUrl();

    if (firebaseUrl) {
      try {
        const cleanUrl = firebaseUrl.replace(/\/$/, '');
        const res = await fetch(`${cleanUrl}/orders/${newOrder.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        });

        if (res.ok) {
          // Also update local cache
          const current = readLocalOrders();
          writeLocalOrders([newOrder, ...current.filter((o) => o.id !== newOrder.id)]);
          return NextResponse.json({ success: true, order: newOrder, source: 'cloud' });
        }
      } catch (err) {
        console.error('Error saving to Firebase RTDB, falling back to local store:', err);
      }
    }

    // Save locally
    const current = readLocalOrders();
    const updated = [newOrder, ...current.filter((o) => o.id !== newOrder.id)];
    writeLocalOrders(updated);

    return NextResponse.json({ success: true, order: newOrder, source: 'local' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal menyimpan pesanan' },
      { status: 500 }
    );
  }
}

// PUT: Update an entire order
export async function PUT(request: NextRequest) {
  try {
    const updatedOrder: Order = await request.json();

    if (!updatedOrder.id || !updatedOrder.customerName || !updatedOrder.items) {
      return NextResponse.json(
        { success: false, error: 'Data pesanan tidak lengkap' },
        { status: 400 }
      );
    }

    const firebaseUrl = getFirebaseUrl();

    if (firebaseUrl) {
      try {
        const cleanUrl = firebaseUrl.replace(/\/$/, '');
        const res = await fetch(`${cleanUrl}/orders/${updatedOrder.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedOrder),
        });

        if (res.ok) {
          const current = readLocalOrders();
          const updated = current.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
          writeLocalOrders(updated);
          return NextResponse.json({ success: true, order: updatedOrder, source: 'cloud' });
        }
      } catch (err) {
        console.error('Error updating order in Firebase RTDB, falling back to local store:', err);
      }
    }

    const current = readLocalOrders();
    const updated = current.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    writeLocalOrders(updated);

    return NextResponse.json({ success: true, order: updatedOrder, source: 'local' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memperbarui data pesanan' },
      { status: 500 }
    );
  }
}

// PATCH: Update status of an order
export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'ID pesanan dan status wajib diisi' },
        { status: 400 }
      );
    }

    const firebaseUrl = getFirebaseUrl();

    if (firebaseUrl) {
      try {
        const cleanUrl = firebaseUrl.replace(/\/$/, '');
        const res = await fetch(`${cleanUrl}/orders/${orderId}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });

        if (res.ok) {
          const current = readLocalOrders();
          const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
          writeLocalOrders(updated);
          return NextResponse.json({ success: true, orderId, status, source: 'cloud' });
        }
      } catch (err) {
        console.error('Error updating status in Firebase, falling back to local store:', err);
      }
    }

    // Update locally
    const current = readLocalOrders();
    const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
    writeLocalOrders(updated);

    return NextResponse.json({ success: true, orderId, status, source: 'local' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memperbarui status' },
      { status: 500 }
    );
  }
}

// DELETE: Clear orders (protected by admin PIN)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get('pin');
    const orderId = searchParams.get('orderId');

    if (pin !== '1290') {
      return NextResponse.json({ success: false, error: 'Akses PIN ditolak' }, { status: 401 });
    }

    const firebaseUrl = getFirebaseUrl();

    if (orderId) {
      // Delete single order
      if (firebaseUrl) {
        try {
          const cleanUrl = firebaseUrl.replace(/\/$/, '');
          await fetch(`${cleanUrl}/orders/${orderId}.json`, { method: 'DELETE' });
        } catch {}
      }
      const current = readLocalOrders();
      writeLocalOrders(current.filter((o) => o.id !== orderId));
      return NextResponse.json({ success: true, deletedId: orderId });
    } else {
      // Clear all orders
      if (firebaseUrl) {
        try {
          const cleanUrl = firebaseUrl.replace(/\/$/, '');
          await fetch(`${cleanUrl}/orders.json`, { method: 'DELETE' });
        } catch {}
      }
      writeLocalOrders([]);
      return NextResponse.json({ success: true, cleared: true });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal menghapus data pesanan' },
      { status: 500 }
    );
  }
}
