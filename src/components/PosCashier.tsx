'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Product } from '@/types';
import { OFFICIAL_PRODUCTS, BRAND_INFO } from '@/data/products';
import { formatRupiah, generateTransactionId } from '@/utils/formatters';
import { ReceiptModal } from '@/components/ReceiptModal';
import {
  ShieldCheck,
  Lock,
  DollarSign,
  Package,
  ShoppingBag,
  Printer,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  CheckCheck,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const PosCashier: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Manual Walk-in Order state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCustomer, setManualCustomer] = useState('Pelanggan Stand Langsung');
  const [manualCart, setManualCart] = useState<{ [productId: string]: number }>({});
  const [manualFlavor, setManualFlavor] = useState<{ [productId: string]: string }>({
    'es-gabin': 'Milo',
  });

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const saved = localStorage.getItem('binary_bite_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        // Initial sample order for demonstration if empty
        const initialSample: Order[] = [
          {
            id: 'BB-20261127-0001',
            customerName: 'Nisrina Admin',
            customerContact: 'Kelas 12B / Stand',
            pickupMethod: 'Ambil di Stand 12B',
            notes: 'Pesanan uji coba sistem stand',
            items: [
              {
                productId: 'es-gabin',
                name: 'Es Gabin',
                price: 9000,
                quantity: 2,
                selectedFlavor: 'Milo',
                subtotal: 18000,
              },
              {
                productId: 'es-capcin',
                name: 'Es Capcin',
                price: 6000,
                quantity: 1,
                subtotal: 6000,
              },
            ],
            totalPrice: 24000,
            totalItems: 3,
            status: 'Diproses',
            createdAt: new Date().toISOString(),
          },
        ];
        setOrders(initialSample);
        localStorage.setItem('binary_bite_orders', JSON.stringify(initialSample));
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2789') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem('binary_bite_orders', JSON.stringify(updated));
    } catch {}
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const totalPortionsSold = orders
    .filter((o) => o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + o.totalItems, 0);

  // Sales breakdown per product
  const menuSalesSummary = OFFICIAL_PRODUCTS.map((product) => {
    let soldQty = 0;
    let revenue = 0;
    orders
      .filter((o) => o.status !== 'Dibatalkan')
      .forEach((order) => {
        order.items.forEach((item) => {
          if (item.productId === product.id) {
            soldQty += item.quantity;
            revenue += item.subtotal;
          }
        });
      });
    return {
      product,
      soldQty,
      revenue,
    };
  });

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'Semua' || order.status === statusFilter;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerContact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle Manual Order Submission
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsList: any[] = [];
    let calcTotal = 0;
    let calcPortions = 0;

    OFFICIAL_PRODUCTS.forEach((prod) => {
      const qty = manualCart[prod.id] || 0;
      if (qty > 0) {
        const flavor = prod.flavors ? manualFlavor[prod.id] || prod.flavors[0] : undefined;
        const subtotal = prod.price * qty;
        itemsList.push({
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: qty,
          selectedFlavor: flavor,
          subtotal,
        });
        calcTotal += subtotal;
        calcPortions += qty;
      }
    });

    if (itemsList.length === 0) {
      alert('Pilih minimal satu produk untuk pesanan langsung!');
      return;
    }

    const newOrder: Order = {
      id: generateTransactionId(),
      customerName: manualCustomer.trim() || 'Pembeli Stand Langsung',
      customerContact: 'Pembelian Langsung Stand 12B',
      pickupMethod: 'Ambil di Stand 12B',
      notes: 'Transaksi Langsung Kasir Stand',
      items: itemsList,
      totalPrice: calcTotal,
      totalItems: calcPortions,
      status: 'Selesai',
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem('binary_bite_orders', JSON.stringify(updated));
    } catch {}

    // Reset manual form
    setManualCart({});
    setShowManualModal(false);
    setSelectedReceiptOrder(newOrder);
  };

  // If not authenticated, show PIN gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-8 max-w-sm w-full shadow-solid-cobalt">
          <div className="w-14 h-14 rounded-2xl bg-brand-sky border-2 border-brand-royal flex items-center justify-center text-brand-cobalt mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-brand-cobalt text-center">
            Akses POS Kasir & Admin
          </h2>
          <p className="text-xs text-brand-muted text-center mt-1">
            Masukkan PIN Kasir untuk mengelola pesanan Stand XII B.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan 4 Digit PIN"
                className="w-full text-center font-mono text-2xl tracking-[0.5em] py-3 bg-brand-white border-2 border-brand-royal rounded-xl text-brand-cobalt focus:outline-none focus:border-brand-cobalt"
              />
              {pinError && (
                <p className="text-xs text-red-600 font-bold text-center mt-2">
                  PIN salah. Coba lagi!
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold rounded-2xl shadow-btn-sky transition-all text-sm active:scale-95"
            >
              Masuk Dashboard Kasir
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Area Khusus: Hanya dapat diakses oleh Admin & Petugas Stand 12B
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-brand-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-sky border border-brand-royal rounded-full text-xs font-mono font-bold text-brand-cobalt mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-electric" />
            <span>POS TERMINAL STAND 12B • LIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-cobalt">
            Dashboard Kasir & Manajemen Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Acara: {BRAND_INFO.eventDateText} • Admin: {BRAND_INFO.adminName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2.5 bg-brand-cobalt text-brand-white text-xs sm:text-sm font-bold rounded-xl border border-brand-cobalt shadow-solid-electric hover:bg-brand-royal flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Pesanan Stand Langsung</span>
          </button>
          <button
            onClick={loadOrders}
            className="p-2.5 bg-brand-white border-2 border-brand-royal text-brand-cobalt rounded-xl hover:bg-brand-sky"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-5 shadow-flat-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-sky border border-brand-royal flex items-center justify-center text-brand-cobalt">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-brand-muted uppercase">
              Total Omzet Penjualan
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-brand-cobalt">
              {formatRupiah(totalRevenue)}
            </div>
          </div>
        </div>

        <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-5 shadow-flat-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-sky border border-brand-royal flex items-center justify-center text-brand-cobalt">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-brand-muted uppercase">
              Porsi / Pcs Terjual
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-brand-cobalt">
              {totalPortionsSold} pcs
            </div>
          </div>
        </div>

        <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-5 shadow-flat-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-sky border border-brand-royal flex items-center justify-center text-brand-cobalt">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-brand-muted uppercase">
              Total Pesanan Masuk
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-brand-cobalt">
              {orders.length} Transaksi
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sales Breakdown Recap */}
      <div className="bg-brand-sky border-2 border-brand-cobalt rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-cobalt" />
          <h3 className="font-extrabold text-base sm:text-lg text-brand-cobalt">
            Rekap Penjualan Per Menu Stand
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {menuSalesSummary.map((item) => (
            <div
              key={item.product.id}
              className="bg-brand-white border border-brand-royal rounded-xl p-3 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-brand-royal">
                  {item.product.code}
                </span>
                <h4 className="font-bold text-xs text-brand-cobalt truncate">
                  {item.product.name}
                </h4>
              </div>
              <div className="mt-3 pt-2 border-t border-brand-line">
                <div className="text-base font-mono font-black text-brand-electric">
                  {item.soldQty} <span className="text-[10px] font-normal text-brand-muted">pcs</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-brand-cobalt">
                  {formatRupiah(item.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl p-6 shadow-flat-md space-y-4">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['Semua', 'Menunggu konfirmasi', 'Diproses', 'Siap diambil', 'Selesai'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  statusFilter === status
                    ? 'bg-brand-cobalt text-brand-white border-brand-cobalt'
                    : 'bg-brand-white text-brand-slate border-brand-line hover:border-brand-royal'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama / No. Trx..."
              className="w-full pl-9 pr-3 py-2 bg-brand-white border border-brand-royal rounded-xl text-xs text-brand-slate focus:outline-none focus:border-brand-cobalt"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto border-2 border-brand-line rounded-xl">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-brand-sky border-b-2 border-brand-line font-mono text-[11px] text-brand-cobalt uppercase">
              <tr>
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Menu & Kuantitas</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status Pesanan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-muted">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-cobalt">
                      {order.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-brand-slate">{order.customerName}</div>
                      <div className="text-[11px] text-brand-muted">{order.customerContact}</div>
                      <div className="text-[10px] text-brand-royal font-semibold mt-0.5">
                        {order.pickupMethod}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="text-brand-slate text-[11px]">
                            • {i.name} {i.selectedFlavor && `(${i.selectedFlavor})`}{' '}
                            <strong className="text-brand-cobalt">x{i.quantity}</strong>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-brand-cobalt text-sm">
                      {formatRupiah(order.totalPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          order.status === 'Selesai'
                            ? 'bg-green-50 text-green-700 border-green-400'
                            : order.status === 'Diproses'
                            ? 'bg-blue-50 text-blue-700 border-blue-400'
                            : order.status === 'Siap diambil'
                            ? 'bg-amber-50 text-amber-700 border-amber-400'
                            : order.status === 'Dibatalkan'
                            ? 'bg-red-50 text-red-700 border-red-400'
                            : 'bg-brand-sky text-brand-cobalt border-brand-royal'
                        }`}
                      >
                        <option value="Menunggu konfirmasi">Menunggu konfirmasi</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Siap diambil">Siap diambil</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-2.5 py-1.5 bg-brand-white border border-brand-royal text-brand-cobalt rounded-lg hover:bg-brand-sky flex items-center gap-1 ml-auto font-mono text-[11px] font-bold"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Walk-in Order Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate/80 overflow-y-auto">
          <div className="bg-brand-white border-2 border-brand-cobalt rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-line">
              <h3 className="font-extrabold text-base sm:text-lg text-brand-cobalt">
                Input Transaksi Stand Langsung (Walk-In)
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-lg bg-brand-sky text-brand-cobalt font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-cobalt mb-1">
                  Nama Pelanggan / Catatan Meja
                </label>
                <input
                  type="text"
                  value={manualCustomer}
                  onChange={(e) => setManualCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-white border border-brand-royal rounded-xl text-xs font-medium"
                />
              </div>

              {/* Product selector table */}
              <div className="space-y-2 border border-brand-line rounded-xl p-3 max-h-60 overflow-y-auto">
                <span className="text-[11px] font-mono font-bold text-brand-muted block uppercase">
                  Pilih Menu & Kuantitas:
                </span>
                {OFFICIAL_PRODUCTS.map((prod) => {
                  const qty = manualCart[prod.id] || 0;
                  return (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-brand-line rounded-lg"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-bold text-xs text-brand-cobalt truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] font-mono text-brand-muted">
                          {formatRupiah(prod.price)}
                        </div>
                        {prod.flavors && qty > 0 && (
                          <div className="flex gap-1 mt-1">
                            {prod.flavors.map((fl) => (
                              <button
                                key={fl}
                                type="button"
                                onClick={() =>
                                  setManualFlavor((prev) => ({ ...prev, [prod.id]: fl }))
                                }
                                className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                                  manualFlavor[prod.id] === fl
                                    ? 'bg-brand-cobalt text-white'
                                    : 'bg-white border text-brand-slate'
                                }`}
                              >
                                {fl}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-brand-white border border-brand-royal rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setManualCart((prev) => ({
                              ...prev,
                              [prod.id]: Math.max(0, qty - 1),
                            }))
                          }
                          className="w-6 h-6 rounded bg-brand-sky text-brand-cobalt font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs text-brand-cobalt">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setManualCart((prev) => ({
                              ...prev,
                              [prod.id]: qty + 1,
                            }))
                          }
                          className="w-6 h-6 rounded bg-brand-cobalt text-brand-white font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-cobalt text-brand-white font-bold rounded-xl text-xs sm:text-sm hover:bg-brand-royal shadow-solid-electric"
              >
                Simpan & Cetak Struk Langsung
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Thermal Receipt Preview Modal */}
      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
};

