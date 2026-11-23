'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Order, OrderStatus, Product, PickupMethod, OrderItem } from '@/types';
import { OFFICIAL_PRODUCTS, BRAND_INFO } from '@/data/products';
import { formatRupiah, generateTransactionId } from '@/utils/formatters';
import {
  calculateNextOrderAllocation,
  calculateAllocationForDay,
  getDayQuotaSummaryList,
  OFFICIAL_EVENT_DAYS,
  DAILY_PRODUCT_LIMIT,
  DAILY_TOTAL_CAPACITY,
} from '@/utils/dailyQuota';
import { orderService } from '@/services/orderService';
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
  TrendingUp,
  Calendar,
  Bell,
  ArrowLeft,
  ChevronRight,
  Flame,
  AlertTriangle,
  Store,
  Layers,
  Pencil,
  Trash2,
  Truck,
  Minus,
  QrCode,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';

export const PosCashier: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [dayFilter, setDayFilter] = useState<number | 'Semua'>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [syncSource, setSyncSource] = useState<'cloud' | 'local'>('local');
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual Walk-in Order state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualSelectedDay, setManualSelectedDay] = useState<number>(1);
  const [manualPickupMethod, setManualPickupMethod] = useState<PickupMethod>('Ambil di Stand 12B');
  const [manualCart, setManualCart] = useState<{ [productId: string]: number }>({});
  const [manualFlavor, setManualFlavor] = useState<{ [productId: string]: string }>({
    'es-gabin': 'Coklat',
  });

  // Edit Order Modal state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerContact, setEditCustomerContact] = useState('');
  const [editPickupMethod, setEditPickupMethod] = useState<PickupMethod>('Ambil di Stand 12B');
  const [editScheduledDayIndex, setEditScheduledDayIndex] = useState<number>(1);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<OrderStatus>('Menunggu konfirmasi');
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleStartEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditCustomerName(order.customerName);
    setEditCustomerContact(order.customerContact);
    setEditPickupMethod(
      order.pickupMethod?.includes('Stand') || order.pickupMethod === 'Stand Langsung'
        ? 'Ambil di Stand 12B'
        : 'Diantar di Lumajang Kota (Free Delivery)'
    );
    setEditScheduledDayIndex(order.scheduledDayIndex || 1);
    setEditNotes(order.notes && order.notes !== '-' ? order.notes : '');
    setEditStatus(order.status);
    setEditItems(
      order.items.map((i) => ({
        ...i,
        selectedFlavor: i.selectedFlavor === 'Milo' ? 'Coklat' : i.selectedFlavor,
      }))
    );
  };

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setEditItems((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      setEditItems((prev) =>
        prev.map((item, idx) =>
          idx === index
            ? { ...item, quantity: newQty, subtotal: item.price * newQty }
            : item
        )
      );
    }
  };

  const handleAddItemToEdit = (prod: Product, flavor?: string) => {
    const existingIndex = editItems.findIndex(
      (item) => item.productId === prod.id && (flavor ? item.selectedFlavor === flavor : true)
    );

    if (existingIndex >= 0) {
      handleUpdateItemQuantity(existingIndex, editItems[existingIndex].quantity + 1);
    } else {
      const newItem: OrderItem = {
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        selectedFlavor: flavor,
        subtotal: prod.price,
      };
      setEditItems((prev) => [...prev, newItem]);
    }
  };

  const handleSaveEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    if (editItems.length === 0) {
      alert('Pesanan harus memiliki minimal satu item menu!');
      return;
    }

    setIsSavingEdit(true);
    const targetDay =
      OFFICIAL_EVENT_DAYS.find((d) => d.dayIndex === editScheduledDayIndex) ||
      OFFICIAL_EVENT_DAYS[0];

    const calcTotal = editItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calcPortions = editItems.reduce((sum, item) => sum + item.quantity, 0);

    const updatedOrder: Order = {
      ...editingOrder,
      customerName: editCustomerName.trim() || editingOrder.customerName,
      customerContact: editCustomerContact.trim() || editingOrder.customerContact,
      pickupMethod: editPickupMethod,
      notes: editNotes.trim() || '-',
      status: editStatus,
      scheduledDayIndex: editScheduledDayIndex,
      scheduledDate: targetDay.dateStr,
      items: editItems.map((i) => ({
        ...i,
        subtotal: i.price * i.quantity,
        selectedFlavor: i.selectedFlavor === 'Milo' ? 'Coklat' : i.selectedFlavor,
      })),
      totalPrice: calcTotal,
      totalItems: calcPortions,
    };

    await orderService.updateOrder(updatedOrder);
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setIsSavingEdit(false);
    setEditingOrder(null);
  };

  const handleDeleteCurrentOrder = async () => {
    if (!editingOrder) return;
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus pesanan #${editingOrder.id} (${editingOrder.customerName}) secara permanen?`
      )
    ) {
      await orderService.deleteOrder(editingOrder.id, '2789');
      setOrders((prev) => prev.filter((o) => o.id !== editingOrder.id));
      setEditingOrder(null);
    }
  };

  const ordersRef = useRef<Order[]>(orders);
  ordersRef.current = orders;

  // Load orders from cloud / local
  const loadOrders = async () => {
    setIsRefreshing(true);
    try {
      const res = await orderService.getOrders();
      setSyncSource(res.source);

      // Check if new orders arrived compared to previous state
      if (ordersRef.current.length > 0 && res.orders.length > ordersRef.current.length) {
        const latest = res.orders[0];
        setNewOrderAlert(`Pesanan baru #${latest.id.slice(-4)} masuk dari ${latest.customerName}!`);
      }
      setOrders(res.orders);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearAllOrders = async () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh riwayat pesanan POS?')) {
      await orderService.clearAll('2789');
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();

    // Auto-poll cloud database every 4 seconds for live sync
    const interval = setInterval(() => {
      loadOrders();
    }, 4000);

    return () => clearInterval(interval);
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

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await orderService.updateStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const totalPortionsSold = orders
    .filter((o) => o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + o.totalItems, 0);

  const activeQueueCount = orders.filter(
    (o) => o.status === 'Menunggu konfirmasi' || o.status === 'Diproses'
  ).length;

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

  // 3-Day Quota Summaries
  const daySummaries = getDayQuotaSummaryList(orders);

  // Filtered orders
  const filteredOrders = orders.filter((order, idx) => {
    const matchesStatus = statusFilter === 'Semua' || order.status === statusFilter;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerContact.toLowerCase().includes(searchTerm.toLowerCase());

    const assignedDay = order.scheduledDayIndex || 1;
    const matchesDay = dayFilter === 'Semua' || assignedDay === dayFilter;

    return matchesStatus && matchesSearch && matchesDay;
  });

  // Handle Manual Walk-in Order Submission
  const handleCreateManualOrder = async (e: React.FormEvent) => {
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

    const alloc = calculateAllocationForDay(orders, manualSelectedDay);

    const newOrder: Order = {
      id: generateTransactionId(),
      customerName: manualCustomer.trim() || 'Pembeli Stand Langsung',
      customerContact: 'Pembelian Langsung Stand 12B',
      pickupMethod: manualPickupMethod,
      notes:
        manualPickupMethod === 'Diantar di Lumajang Kota (Free Delivery)'
          ? 'Transaksi Diantar Stand Lumajang Kota'
          : 'Transaksi Langsung Stand Lumajang Kota',
      items: itemsList,
      totalPrice: calcTotal,
      totalItems: calcPortions,
      status: 'Selesai',
      createdAt: new Date().toISOString(),
      scheduledDate: alloc.scheduledDate,
      scheduledDayIndex: alloc.scheduledDayIndex,
      dailyOrderNumber: alloc.dailyOrderNumber,
      isRollover: alloc.isRollover,
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    await orderService.createOrder(newOrder);

    // Reset manual form
    setManualCart({});
    setShowManualModal(false);
    setSelectedReceiptOrder(newOrder);
  };

  const handleVerifyQrisPayment = async (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    const updated: Order = {
      ...target,
      paymentStatus: 'Lunas',
      status: target.status === 'Menunggu konfirmasi' ? 'Diproses' : target.status,
    };
    await orderService.updateOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    setSelectedProofOrder(null);
  };

  // If not authenticated, show modern PIN gate card
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-card-paper border border-sky-100 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] mx-auto mb-5 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-heading font-bold text-[#0284C7] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PORTAL KASIR STAND 12B</span>
          </div>

          <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
            Akses POS & Dashboard Kasir
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Masukkan PIN 4-digit kasir untuk mengelola data transaksi, kuota 3 hari, dan mencetak struk Stand 12B.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center font-mono text-3xl tracking-[0.6em] py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
              />
              {pinError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-bold mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>PIN salah. Masukkan 4 digit PIN kasir yang benar.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-heading font-black rounded-2xl shadow-btn-sky transition-all text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Buka Terminal Kasir
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-400">
            <Link href="/" className="hover:text-[#0284C7] font-medium flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Toko</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Realtime Alert Banner */}
      {newOrderAlert && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-card-paper animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div>
              <span className="font-heading font-black text-sm sm:text-base block">{newOrderAlert}</span>
              <span className="text-[11px] text-emerald-100">Data telah otomatis diperbarui dari cloud real-time.</span>
            </div>
          </div>
          <button
            onClick={() => setNewOrderAlert(null)}
            className="text-xs font-heading font-bold px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-mono font-bold text-[#0284C7]">
              <Store className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>POS STAND 12B OFFICIAL</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                syncSource === 'cloud'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncSource === 'cloud' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{syncSource === 'cloud' ? 'Cloud Sync Real-time (Singapore)' : 'Mode Lokal / Fallback'}</span>
            </div>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Dashboard Kasir & Manajemen Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jadwal Buka: <span className="font-semibold text-slate-700">{BRAND_INFO.eventDaysDetailed}</span> • Admin:{' '}
            <span className="font-semibold text-slate-700">{BRAND_INFO.adminName}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-heading font-black rounded-2xl shadow-btn-sky flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Pesanan Langsung</span>
          </button>

          <button
            onClick={loadOrders}
            className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#0284C7] hover:border-sky-300 rounded-2xl hover:bg-sky-50 transition-all"
            title="Refresh Data Pesanan"
            aria-label="Refresh Data Pesanan"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0284C7]' : ''}`} />
          </button>

          <button
            onClick={handleClearAllOrders}
            className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl transition-colors"
            title="Kosongkan Semua Riwayat"
          >
            Kosongkan Data
          </button>

          <Link
            href="/"
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
          >
            Lihat Toko
          </Link>
        </div>
      </div>

      {/* 4 Modern Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Omzet */}
        <div className="bg-white rounded-3xl p-5 shadow-card-paper border border-sky-100 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
              Total Omzet Penjualan
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-0.5">
              {formatRupiah(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Metric 2: Porsi Terjual */}
        <div className="bg-white rounded-3xl p-5 shadow-card-paper border border-sky-100 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
              Total Porsi Terjual
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-0.5">
              {totalPortionsSold} <span className="text-xs font-sans font-semibold text-slate-400">pcs</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Transaksi */}
        <div className="bg-white rounded-3xl p-5 shadow-card-paper border border-sky-100 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
              Total Transaksi Masuk
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 mt-0.5">
              {orders.length} <span className="text-xs font-sans font-semibold text-slate-400">pesanan</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Antrean Aktif */}
        <div className="bg-white rounded-3xl p-5 shadow-card-paper border border-sky-100 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
              Antrean Stand Aktif
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-700 mt-0.5">
              {activeQueueCount} <span className="text-xs font-sans font-semibold text-slate-400">proses</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Day Capacity & Schedule Widget (27-29 November 2026) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0284C7]" />
              <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                Alokasi Jadwal & Kuota Produksi (25 Pcs / Menu • Total 125 Porsi / Hari)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kapasitas produksi harian maksimal 25 pcs per varian menu (total 125 porsi/hari). Pelanggan bebas memilih jadwal pengambilan pada tanggal 27, 28, atau 29 November 2026.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {dayFilter !== 'Semua' && (
              <button
                onClick={() => setDayFilter('Semua')}
                className="text-xs font-heading font-bold px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] hover:bg-sky-100 border border-sky-200 transition-all"
              >
                Reset Filter (Tampilkan Semua)
              </button>
            )}
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Kapasitas: 125 Pcs/Hari
            </span>
          </div>
        </div>

        {/* 3 Day Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {daySummaries.map((summary) => {
            const isSelected = dayFilter === summary.dayIndex;

            return (
              <div
                key={summary.dayIndex}
                onClick={() => setDayFilter(isSelected ? 'Semua' : summary.dayIndex)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-[#0284C7] bg-sky-50/70 shadow-md ring-2 ring-[#0284C7]/20'
                    : 'border-slate-200 bg-slate-50/60 hover:border-sky-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      Hari ke-{summary.dayIndex}
                    </span>
                    <h3 className="font-heading font-black text-sm text-slate-900 mt-1.5">{summary.dateStr}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      summary.isFull
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : summary.totalSoldPcs >= 100
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {summary.isFull ? 'KUOTA PENUH' : `Sisa ${summary.remainingPcs} pcs`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Total Produksi Terisi:</span>
                    <span className="font-bold text-slate-800">
                      {summary.totalSoldPcs} / 125 Porsi ({summary.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        summary.isFull
                          ? 'bg-rose-500'
                          : summary.totalSoldPcs >= 100
                          ? 'bg-amber-500'
                          : 'bg-[#0284C7]'
                      }`}
                      style={{ width: `${summary.percentage}%` }}
                    />
                  </div>
                </div>

                {/* 5 Menu Breakdown Chips */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/70">
                  <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Produksi Menu (Maks 25/Menu):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {summary.productQuotas.map((pq) => (
                      <div
                        key={pq.productId}
                        className={`px-2 py-1 rounded-lg border flex items-center justify-between ${
                          pq.isFull
                            ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                            : pq.sold >= 20
                            ? 'bg-amber-50 text-amber-800 border-amber-200 font-medium'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="truncate mr-1">{pq.productName}:</span>
                        <span className="font-mono font-bold whitespace-nowrap">{pq.sold}/25</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">
                    {isSelected ? '✓ Aktif memfilter daftar' : 'Klik untuk filter tabel'}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 ${isSelected ? 'text-[#0284C7] font-bold' : ''}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Sales Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0284C7]" />
          <h2 className="font-heading font-black text-lg text-slate-900">
            Rekapitulasi Penjualan Menu Stand
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {menuSalesSummary.map((item) => (
            <div
              key={item.product.id}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between hover:border-sky-300 hover:bg-white transition-all"
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-[#0284C7] uppercase block">
                  {item.product.code}
                </span>
                <h3 className="font-heading font-bold text-xs text-slate-900 truncate mt-0.5">
                  {item.product.name}
                </h3>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200">
                <div className="text-base font-mono font-black text-[#0284C7]">
                  {item.soldQty} <span className="text-[10px] font-normal text-slate-500">pcs</span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                  {formatRupiah(item.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Management Table & Filter Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card-paper border border-sky-100 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
            {['Semua', 'Menunggu konfirmasi', 'Diproses', 'Siap diambil', 'Selesai', 'Dibatalkan'].map((status) => {
              const count =
                status === 'Semua'
                  ? orders.length
                  : orders.filter((o) => o.status === status).length;
              const isActive = statusFilter === status;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-heading font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama / ID transaksi..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-slate-50 border-b border-slate-200 font-heading font-bold text-[11px] text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. Trx</th>
                <th className="py-3.5 px-4">Pelanggan & Jadwal Ambil</th>
                <th className="py-3.5 px-4">Menu & Kuantitas</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status Pesanan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>Tidak ada data pesanan yang sesuai dengan filter.</span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-sky-50/30 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>

                    {/* Customer & Scheduled Date */}
                    <td className="py-4 px-4">
                      <div className="font-heading font-bold text-slate-900 text-sm">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {order.customerContact}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200">
                          Hari ke-{order.scheduledDayIndex || 1} (#{order.dailyOrderNumber || 1}/25)
                        </span>

                        {order.pickupMethod?.includes('Diantar') || order.pickupMethod === 'Lumajang Kota' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            🚚 Diantar (Free Delivery)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200">
                            🏪 Ambil di Stand 12B
                          </span>
                        )}

                        {order.isRollover && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            Rollover
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        🗓️ {order.scheduledDate || BRAND_INFO.eventDateText}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 max-w-xs">
                        {order.items.map((i, idx) => {
                          const cleanFlavor =
                            i.selectedFlavor === 'Milo' ? 'Coklat' : i.selectedFlavor;
                          return (
                            <div key={idx} className="text-slate-700 text-[11px]">
                              • {i.name}{' '}
                              {cleanFlavor && (
                                <span className="text-[#0284C7] font-semibold">({cleanFlavor})</span>
                              )}{' '}
                              <strong className="text-slate-900 font-mono">x{i.quantity}</strong>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Total & Payment Method */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-black text-slate-900 text-sm">
                        {formatRupiah(order.totalPrice)}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        {order.paymentMethod === 'QRIS' ? (
                          <span className="text-[10px] font-heading font-black px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-0.5">
                            <QrCode className="w-2.5 h-2.5" />
                            <span>QRIS</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            Tunai
                          </span>
                        )}

                        {order.paymentProof && (
                          <button
                            type="button"
                            onClick={() => setSelectedProofOrder(order)}
                            className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-[#0284C7] border border-sky-300 inline-flex items-center gap-1 transition-colors"
                            title="Klik untuk melihat bukti transfer QRIS"
                          >
                            <Eye className="w-2.5 h-2.5" />
                            <span>Bukti</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-heading font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition-all cursor-pointer ${
                          order.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.status === 'Diproses'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : order.status === 'Siap diambil'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : order.status === 'Dibatalkan'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <option value="Menunggu konfirmasi">Menunggu konfirmasi</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Siap diambil">Siap diambil</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEditOrder(order)}
                          className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0284C7] rounded-xl flex items-center gap-1 font-heading font-bold text-xs transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                          title="Edit Pesanan Ini"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0284C7] hover:border-sky-300 rounded-xl hover:bg-sky-50 flex items-center gap-1 font-heading font-bold text-xs transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                          title="Cetak Struk Thermal"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#0284C7]" />
                          <span>Struk</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Walk-in Order Modal with 3-Day Selector */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-sky-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Input Pesanan Langsung (Walk-In)
                  </h3>
                  <span className="text-[11px] text-slate-500">Pencatatan kasir instan stand</span>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                  Nama Pelanggan / Catatan Meja
                </label>
                <input
                  type="text"
                  value={manualCustomer}
                  onChange={(e) => setManualCustomer(e.target.value)}
                  placeholder="Contoh: Bu Guru Ani / Meja 3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                />
              </div>

              {/* Day selection for Walk-in */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 mb-1.5">
                  Pilih Jadwal Acara Stand:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {OFFICIAL_EVENT_DAYS.map((day) => (
                    <button
                      key={day.dayIndex}
                      type="button"
                      onClick={() => setManualSelectedDay(day.dayIndex)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        manualSelectedDay === day.dayIndex
                          ? 'border-[#0284C7] bg-sky-50/70 text-[#0284C7] ring-1 ring-[#0284C7]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold block uppercase">
                        Hari {day.dayIndex}
                      </span>
                      <span className="font-heading font-bold text-[11px] block truncate">
                        {day.dateShort}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup / Delivery Method selection for Walk-in */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 mb-1.5">
                  Metode Pengambilan / Pengiriman:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualPickupMethod('Ambil di Stand 12B')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      manualPickupMethod === 'Ambil di Stand 12B'
                        ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-heading font-bold text-xs block">
                      Ambil di Stand 12B
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Diambil di lokasi stand
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setManualPickupMethod('Diantar di Lumajang Kota (Free Delivery)')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      manualPickupMethod === 'Diantar di Lumajang Kota (Free Delivery)'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-heading font-bold text-xs block">
                      Diantar Lumajang Kota
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      Free Delivery
                    </span>
                  </button>
                </div>
              </div>

              {/* Product selector list */}
              <div className="space-y-2 border border-slate-200 rounded-2xl p-3.5 max-h-60 overflow-y-auto bg-slate-50/50">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">
                  Pilih Menu & Kuantitas:
                </span>
                {OFFICIAL_PRODUCTS.map((prod) => {
                  const qty = manualCart[prod.id] || 0;
                  return (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="font-heading font-bold text-xs text-slate-900 truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#0284C7] font-semibold">
                          {formatRupiah(prod.price)}
                        </div>

                        {prod.flavors && qty > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {prod.flavors.map((fl) => (
                              <button
                                key={fl}
                                type="button"
                                onClick={() =>
                                  setManualFlavor((prev) => ({ ...prev, [prod.id]: fl }))
                                }
                                className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-colors ${
                                  manualFlavor[prod.id] === fl
                                    ? 'bg-[#0284C7] text-white font-bold'
                                    : 'bg-slate-100 border border-slate-200 text-slate-600'
                                }`}
                              >
                                {fl}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stepper (+ / -) */}
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            setManualCart((prev) => ({
                              ...prev,
                              [prod.id]: Math.max(0, qty - 1),
                            }))
                          }
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center text-xs shadow-xs hover:bg-slate-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
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
                          className="w-7 h-7 rounded-lg bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs shadow-xs hover:bg-[#0369A1] transition-colors"
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
                className="w-full py-3.5 bg-[#0284C7] text-white font-heading font-black rounded-2xl text-xs sm:text-sm hover:bg-[#0369A1] shadow-btn-sky transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Simpan & Cetak Struk Langsung
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-sky-100 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-200">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-black text-lg text-slate-900">
                      Edit Transaksi #{editingOrder.id}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {editingOrder.createdAt
                        ? new Date(editingOrder.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sesuaikan identitas pemesan, tanggal acara, metode pengiriman, dan item menu.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEditOrder} className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Row 1: Customer Name & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                    Nama Pemesan *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                    Kelas / No. WhatsApp / Kontak *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCustomerContact}
                    onChange={(e) => setEditCustomerContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Scheduled Day Selector (3 Hari Acara) */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Jadwal Pengambilan Stand (27 s/d 29 Nov 2026):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {OFFICIAL_EVENT_DAYS.map((day) => (
                    <button
                      key={day.dayIndex}
                      type="button"
                      onClick={() => setEditScheduledDayIndex(day.dayIndex)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        editScheduledDayIndex === day.dayIndex
                          ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] ring-1 ring-[#0284C7] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-mono text-[9px] uppercase block">
                        Hari ke-{day.dayIndex}
                      </span>
                      <span className="text-[11px] font-heading font-black block truncate">
                        {day.dayName}, {day.dateShort}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Pickup / Delivery Method */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Pilihan Metode Pengambilan / Pengiriman:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditPickupMethod('Ambil di Stand 12B')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      editPickupMethod === 'Ambil di Stand 12B'
                        ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-heading font-black text-xs block">
                        Ambil di Stand 12B
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Ambil langsung di lokasi acara
                      </span>
                    </div>
                    {editPickupMethod === 'Ambil di Stand 12B' && (
                      <CheckCircle className="w-4 h-4 text-[#0284C7]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditPickupMethod('Diantar di Lumajang Kota (Free Delivery)')
                    }
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      editPickupMethod === 'Diantar di Lumajang Kota (Free Delivery)'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-heading font-black text-xs block">
                        Diantar di Lumajang Kota
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Free Delivery / Gratis Ongkir
                      </span>
                    </div>
                    {editPickupMethod === 'Diantar di Lumajang Kota (Free Delivery)' && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Row 4: Notes / Address & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                    Catatan / Alamat Pengantaran
                  </label>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Contoh: Jl. Panjaitan No. 12 / tanpa sambal"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-slate-800 mb-1">
                    Status Pesanan
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value="Menunggu konfirmasi">Menunggu konfirmasi</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Siap diambil">Siap diambil</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Order Items List & Modification */}
              <div className="space-y-2 border border-slate-200 rounded-2xl p-3.5 bg-slate-50/70">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-[11px] font-heading font-bold text-slate-700 uppercase tracking-wider">
                    Daftar Menu Pesanan:
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0284C7]">
                    {editItems.reduce((sum, item) => sum + item.quantity, 0)} pcs •{' '}
                    {formatRupiah(
                      editItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    )}
                  </span>
                </div>

                {editItems.length === 0 ? (
                  <div className="py-4 text-center text-xs text-rose-600 font-medium">
                    Belum ada menu di pesanan ini. Silakan klik menu di bawah untuk menambahkan.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {editItems.map((item, idx) => (
                      <div
                        key={`${item.productId}-${item.selectedFlavor || 'default'}-${idx}`}
                        className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-xl shadow-xs"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="font-heading font-bold text-xs text-slate-900 truncate">
                            {item.name}
                            {item.selectedFlavor && (
                              <span className="text-[#0284C7] font-semibold ml-1">
                                ({item.selectedFlavor})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {formatRupiah(item.price)} x {item.quantity} ={' '}
                            <strong className="text-slate-800">
                              {formatRupiah(item.price * item.quantity)}
                            </strong>
                          </div>
                        </div>

                        {/* Stepper + Delete */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(idx, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-white text-slate-700 font-bold flex items-center justify-center text-xs shadow-xs hover:bg-slate-50"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-mono font-bold text-xs text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(idx, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs shadow-xs hover:bg-[#0369A1]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(idx, 0)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Hapus menu ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add Menu Buttons */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-heading font-bold text-slate-500 uppercase block mb-1.5">
                    + Tambah Menu ke Pesanan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {OFFICIAL_PRODUCTS.map((prod) => {
                      if (prod.flavors && prod.flavors.length > 0) {
                        return prod.flavors.map((flavor) => (
                          <button
                            key={`${prod.id}-${flavor}`}
                            type="button"
                            onClick={() => handleAddItemToEdit(prod, flavor)}
                            className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-[10px] font-heading font-bold text-slate-700 hover:text-[#0284C7] transition-all shadow-xs"
                          >
                            + {prod.name} ({flavor})
                          </button>
                        ));
                      }
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => handleAddItemToEdit(prod)}
                          className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-[10px] font-heading font-bold text-slate-700 hover:text-[#0284C7] transition-all shadow-xs"
                        >
                          + {prod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleDeleteCurrentOrder}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-heading font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Hapus Pesanan Ini</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-heading font-bold transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingEdit || editItems.length === 0}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-heading font-black shadow-btn-sky transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  >
                    {isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
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

      {/* Modal Preview Bukti Transfer QRIS */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-sky-100 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Bukti Pembayaran QRIS
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedProofOrder.id} • {selectedProofOrder.customerName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProofOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content: Image Preview & Details */}
            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Tagihan</span>
                  <span className="text-base font-mono font-black text-slate-900">
                    {formatRupiah(selectedProofOrder.totalPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status Bayar</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      selectedProofOrder.paymentStatus === 'Lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedProofOrder.paymentStatus || 'Menunggu verifikasi'}
                  </span>
                </div>
              </div>

              {selectedProofOrder.paymentProof ? (
                <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 text-center relative group">
                  <img
                    src={selectedProofOrder.paymentProof}
                    alt="Bukti Transfer QRIS"
                    className="w-full h-auto max-h-[50vh] object-contain mx-auto"
                  />
                  <a
                    href={selectedProofOrder.paymentProof}
                    target="_blank"
                    rel="noreferrer"
                    download={`Bukti-QRIS-${selectedProofOrder.id}.jpg`}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-heading font-bold shadow-sm backdrop-blur-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Buka Penuh / Unduh</span>
                  </a>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Tidak ada gambar bukti yang dilampirkan.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedProofOrder(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-heading font-bold transition-colors"
              >
                Tutup
              </button>

              {selectedProofOrder.paymentStatus !== 'Lunas' && (
                <button
                  type="button"
                  onClick={() => handleVerifyQrisPayment(selectedProofOrder.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Verifikasi & Tandai Lunas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
