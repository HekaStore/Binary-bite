import { Order } from '@/types';

export const DAILY_ORDER_LIMIT = 25;

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

export interface QuotaAllocation {
  scheduledDate: string;
  scheduledDayIndex: number;
  dailyOrderNumber: number;
  isRollover: boolean;
  currentDayOrdersCount: number;
  dayLabel: string;
  isFull: boolean;
}

/**
 * Counts active (non-cancelled) orders for a specific dayIndex.
 */
export function getOrdersCountForDay(orders: Order[], dayIndex: number): number {
  return orders.filter((o) => {
    if (o.status === 'Dibatalkan') return false;
    if (o.scheduledDayIndex) {
      return o.scheduledDayIndex === dayIndex;
    }
    // Fallback: match by dateStr
    const eventDay = getEventDay(dayIndex);
    return o.scheduledDate?.includes(eventDay.dateShort);
  }).length;
}

/**
 * Calculates allocation for a specific chosen dayIndex,
 * or recommends the first available day if chosen day is full.
 */
export function calculateAllocationForDay(orders: Order[], chosenDayIndex: number = 1): QuotaAllocation {
  const count = getOrdersCountForDay(orders, chosenDayIndex);
  const isFull = count >= DAILY_ORDER_LIMIT;
  const eventDay = getEventDay(chosenDayIndex);

  return {
    scheduledDate: eventDay.dateStr,
    scheduledDayIndex: chosenDayIndex,
    dailyOrderNumber: count + 1,
    isRollover: isFull,
    currentDayOrdersCount: count,
    dayLabel: eventDay.dayLabel,
    isFull,
  };
}

/**
 * Automatic allocation: returns the first day (Day 1..3) that still has available quota.
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

export interface DayQuotaSummary {
  dayIndex: number;
  dayLabel: string;
  dateStr: string;
  dateShort: string;
  count: number;
  limit: number;
  remaining: number;
  isFull: boolean;
  percentage: number;
  orders: Order[];
}

/**
 * Returns a clean 3-day breakdown of orders and capacity for POS Admin & customer selector.
 */
export function getDayQuotaSummaryList(orders: Order[]): DayQuotaSummary[] {
  return OFFICIAL_EVENT_DAYS.map((day) => {
    const dayOrders = orders.filter((o) => {
      if (o.scheduledDayIndex) {
        return o.scheduledDayIndex === day.dayIndex;
      }
      return o.scheduledDate?.includes(day.dateShort);
    });

    const activeCount = dayOrders.filter((o) => o.status !== 'Dibatalkan').length;
    const percentage = Math.min(100, Math.round((activeCount / DAILY_ORDER_LIMIT) * 100));

    return {
      dayIndex: day.dayIndex,
      dayLabel: day.dayLabel,
      dateStr: day.dateStr,
      dateShort: day.dateShort,
      count: activeCount,
      limit: DAILY_ORDER_LIMIT,
      remaining: Math.max(0, DAILY_ORDER_LIMIT - activeCount),
      isFull: activeCount >= DAILY_ORDER_LIMIT,
      percentage,
      orders: dayOrders,
    };
  });
}
