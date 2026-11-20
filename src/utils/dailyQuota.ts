import { Order } from '@/types';
import { OFFICIAL_PRODUCTS } from '@/data/products';

export const DAILY_PRODUCT_LIMIT = 25; // 25 pcs per menu item per day
export const TOTAL_PRODUCTS_COUNT = 5; // 5 official products
export const DAILY_TOTAL_CAPACITY = DAILY_PRODUCT_LIMIT * TOTAL_PRODUCTS_COUNT; // 125 pcs total per day

export interface EventDay {
  dayIndex: number;
  dayLabel: string;
  dayName: string;
  dateStr: string;
  dateShort: string;
  isoDate: string;
}

export const OFFICIAL_EVENT_DAYS: EventDay[] = [
  {
    dayIndex: 1,
    dayLabel: 'Hari 1 (Jumat)',
    dayName: 'Jumat',
    dateStr: 'Jumat, 27 November 2026',
    dateShort: '27 Nov',
    isoDate: '2026-11-27',
  },
  {
    dayIndex: 2,
    dayLabel: 'Hari 2 (Sabtu)',
    dayName: 'Sabtu',
    dateStr: 'Sabtu, 28 November 2026',
    dateShort: '28 Nov',
    isoDate: '2026-11-28',
  },
  {
    dayIndex: 3,
    dayLabel: 'Hari 3 (Minggu)',
    dayName: 'Minggu',
    dateStr: 'Minggu, 29 November 2026',
    dateShort: '29 Nov',
    isoDate: '2026-11-29',
  },
];

/**
 * Returns the event day object for a given 1-based dayIndex (1..3).
 * Falls back to Day 1 if out of bounds.
 */
export function getEventDay(dayIndex: number): EventDay {
  const found = OFFICIAL_EVENT_DAYS.find((d) => d.dayIndex === dayIndex);
  return found || OFFICIAL_EVENT_DAYS[0];
}

/**
 * Computes the exact calendar date for a given dayIndex.
 */
export function getDateForDayIndex(dayIndex: number): { dateStr: string; dayLabel: string } {
  const eventDay = getEventDay(dayIndex);
  return {
    dateStr: eventDay.dateStr,
    dayLabel: eventDay.dayLabel,
  };
}

/**
 * Gets active orders for a specific dayIndex.
 */
export function getActiveOrdersForDay(orders: Order[], dayIndex: number): Order[] {
  return orders.filter((o) => {
    if (o.status === 'Dibatalkan') return false;
    if (o.scheduledDayIndex) {
      return o.scheduledDayIndex === dayIndex;
    }
    const eventDay = getEventDay(dayIndex);
    return o.scheduledDate?.includes(eventDay.dateShort);
  });
}

/**
 * Counts total portions (pcs) sold for a specific dayIndex.
 */
export function getTotalPortionsForDay(orders: Order[], dayIndex: number): number {
  const dayOrders = getActiveOrdersForDay(orders, dayIndex);
  return dayOrders.reduce((sum, order) => {
    const orderItemsCount = order.items.reduce((s, item) => s + (item.quantity || 0), 0);
    return sum + (order.totalItems || orderItemsCount);
  }, 0);
}

/**
 * Calculates pieces sold per product ID for a specific dayIndex.
 */
export function getProductSalesForDay(
  orders: Order[],
  dayIndex: number
): { [productId: string]: number } {
  const dayOrders = getActiveOrdersForDay(orders, dayIndex);
  const salesMap: { [productId: string]: number } = {};

  // Initialize with 0
  OFFICIAL_PRODUCTS.forEach((p) => {
    salesMap[p.id] = 0;
  });

  dayOrders.forEach((order) => {
    order.items.forEach((item) => {
      salesMap[item.productId] = (salesMap[item.productId] || 0) + (item.quantity || 0);
    });
  });

  return salesMap;
}

export interface ExceededProductInfo {
  productId: string;
  name: string;
  sold: number;
  requested: number;
  remaining: number;
  limit: number;
}

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  exceededProducts: ExceededProductInfo[];
  totalPcsRequested: number;
  dayTotalSold: number;
  dayRemainingCapacity: number;
  isDayCapacityExceeded: boolean;
  recommendedDayIndex: number;
}

/**
 * Checks if the requested items can fit within a specific day's 25 pcs/product and 125 pcs/day limits.
 * Customers can freely choose any of the 3 days (27, 28, or 29 Nov 2026) as long as capacity remains.
 */
export function checkItemsAvailabilityForDay(
  orders: Order[],
  dayIndex: number,
  items: { productId: string; name?: string; quantity: number }[]
): AvailabilityCheckResult {
  const currentSales = getProductSalesForDay(orders, dayIndex);
  const dayTotalSold = getTotalPortionsForDay(orders, dayIndex);
  const totalPcsRequested = items.reduce((sum, i) => sum + i.quantity, 0);

  const exceededProducts: ExceededProductInfo[] = [];

  // Group requested items by productId (in case of flavors)
  const requestedPerProduct: { [productId: string]: number } = {};
  items.forEach((item) => {
    requestedPerProduct[item.productId] =
      (requestedPerProduct[item.productId] || 0) + item.quantity;
  });

  OFFICIAL_PRODUCTS.forEach((prod) => {
    const requested = requestedPerProduct[prod.id] || 0;
    if (requested > 0) {
      const sold = currentSales[prod.id] || 0;
      if (sold + requested > DAILY_PRODUCT_LIMIT) {
        exceededProducts.push({
          productId: prod.id,
          name: prod.name,
          sold,
          requested,
          remaining: Math.max(0, DAILY_PRODUCT_LIMIT - sold),
          limit: DAILY_PRODUCT_LIMIT,
        });
      }
    }
  });

  const isDayCapacityExceeded = dayTotalSold + totalPcsRequested > DAILY_TOTAL_CAPACITY;
  const isAvailable = exceededProducts.length === 0 && !isDayCapacityExceeded;

  // Find next recommended day if not available on selected day
  let recommendedDayIndex = dayIndex;
  if (!isAvailable) {
    for (let nextDay = 1; nextDay <= 3; nextDay++) {
      if (nextDay === dayIndex) continue;
      const nextSales = getProductSalesForDay(orders, nextDay);
      const nextTotal = getTotalPortionsForDay(orders, nextDay);
      let fits = nextTotal + totalPcsRequested <= DAILY_TOTAL_CAPACITY;

      if (fits) {
        for (const prodId of Object.keys(requestedPerProduct)) {
          const req = requestedPerProduct[prodId];
          const sold = nextSales[prodId] || 0;
          if (sold + req > DAILY_PRODUCT_LIMIT) {
            fits = false;
            break;
          }
        }
      }

      if (fits) {
        recommendedDayIndex = nextDay;
        break;
      }
    }
  }

  return {
    isAvailable,
    exceededProducts,
    totalPcsRequested,
    dayTotalSold,
    dayRemainingCapacity: Math.max(0, DAILY_TOTAL_CAPACITY - dayTotalSold),
    isDayCapacityExceeded,
    recommendedDayIndex,
  };
}

export interface QuotaAllocation {
  scheduledDate: string;
  scheduledDayIndex: number;
  dailyOrderNumber: number;
  isRollover: boolean;
  currentDayPortionsCount: number;
  currentDayOrdersCount: number; // backward compatibility
  dayLabel: string;
  isFull: boolean;
}

/**
 * Calculates allocation for a specific chosen dayIndex.
 */
export function calculateAllocationForDay(
  orders: Order[],
  chosenDayIndex: number = 1
): QuotaAllocation {
  const dayOrders = getActiveOrdersForDay(orders, chosenDayIndex);
  const totalPortions = getTotalPortionsForDay(orders, chosenDayIndex);
  const isFull = totalPortions >= DAILY_TOTAL_CAPACITY;
  const eventDay = getEventDay(chosenDayIndex);

  return {
    scheduledDate: eventDay.dateStr,
    scheduledDayIndex: chosenDayIndex,
    dailyOrderNumber: dayOrders.length + 1,
    isRollover: isFull,
    currentDayPortionsCount: totalPortions,
    currentDayOrdersCount: totalPortions,
    dayLabel: eventDay.dayLabel,
    isFull,
  };
}

/**
 * Automatic allocation: returns the first day (Day 1..3) that still has available capacity.
 */
export function calculateNextOrderAllocation(orders: Order[]): QuotaAllocation {
  for (let d = 1; d <= 3; d++) {
    const alloc = calculateAllocationForDay(orders, d);
    if (!alloc.isFull) {
      return alloc;
    }
  }

  // All 3 days are full, return Day 3 as overflow
  const allocDay3 = calculateAllocationForDay(orders, 3);
  return {
    ...allocDay3,
    isRollover: true,
  };
}

export interface ProductQuotaStatus {
  productId: string;
  productCode: string;
  productName: string;
  sold: number;
  limit: number;
  remaining: number;
  isFull: boolean;
  percentage: number;
}

export interface DayQuotaSummary {
  dayIndex: number;
  dayLabel: string;
  dateStr: string;
  dateShort: string;
  totalSoldPcs: number;
  totalCapacityPcs: number;
  remainingPcs: number;
  ordersCount: number;
  isFull: boolean;
  isUnlocked: boolean;
  lockReason?: string;
  percentage: number;
  productQuotas: ProductQuotaStatus[];
  orders: Order[];
  // Compatibility fields
  count: number;
  limit: number;
  remaining: number;
}

/**
 * Returns a comprehensive 3-day breakdown of orders, total portions (max 125),
 * and per-product quotas (max 25 each).
 * Enforces sequential production: Day 2 is locked until Day 1 reaches 125 pcs;
 * Day 3 is locked until Day 2 reaches 125 pcs.
 */
export function getDayQuotaSummaryList(orders: Order[]): DayQuotaSummary[] {
  const summaries: DayQuotaSummary[] = [];

  for (let i = 0; i < OFFICIAL_EVENT_DAYS.length; i++) {
    const day = OFFICIAL_EVENT_DAYS[i];
    const dayOrders = getActiveOrdersForDay(orders, day.dayIndex);
    const totalSoldPcs = getTotalPortionsForDay(orders, day.dayIndex);
    const productSales = getProductSalesForDay(orders, day.dayIndex);

    const productQuotas: ProductQuotaStatus[] = OFFICIAL_PRODUCTS.map((prod) => {
      const sold = productSales[prod.id] || 0;
      const remaining = Math.max(0, DAILY_PRODUCT_LIMIT - sold);
      const isFull = sold >= DAILY_PRODUCT_LIMIT;
      const percentage = Math.min(100, Math.round((sold / DAILY_PRODUCT_LIMIT) * 100));

      return {
        productId: prod.id,
        productCode: prod.code,
        productName: prod.name,
        sold,
        limit: DAILY_PRODUCT_LIMIT,
        remaining,
        isFull,
        percentage,
      };
    });

    const isFull =
      totalSoldPcs >= DAILY_TOTAL_CAPACITY || productQuotas.every((pq) => pq.isFull);
    const percentage = Math.min(100, Math.round((totalSoldPcs / DAILY_TOTAL_CAPACITY) * 100));
    const remainingPcs = Math.max(0, DAILY_TOTAL_CAPACITY - totalSoldPcs);

    // All event days (27, 28, 29 Nov 2026) are open for pre-orders
    const isUnlocked = true;
    const lockReason = '';

    summaries.push({
      dayIndex: day.dayIndex,
      dayLabel: day.dayLabel,
      dateStr: day.dateStr,
      dateShort: day.dateShort,
      totalSoldPcs,
      totalCapacityPcs: DAILY_TOTAL_CAPACITY,
      remainingPcs,
      ordersCount: dayOrders.length,
      isFull,
      isUnlocked,
      lockReason,
      percentage,
      productQuotas,
      orders: dayOrders,
      // Backward compatibility aliases
      count: totalSoldPcs,
      limit: DAILY_TOTAL_CAPACITY,
      remaining: remainingPcs,
    });
  }

  return summaries;
}
