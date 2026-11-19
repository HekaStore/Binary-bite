import { Order } from '@/types';

export const DAILY_ORDER_LIMIT = 25;

const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDO_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function formatIndoDate(date: Date): string {
  const dayName = INDO_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = INDO_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Returns the base event date (27 November 2026),
 * or current calendar date if today has passed that date.
 */
export function getBaseEventDate(): Date {
  const base = new Date('2026-11-27T00:00:00');
  const now = new Date();
  if (now.getTime() > base.getTime() + 86400000) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  return base;
}

/**
 * Computes the exact calendar date for a given 1-based day index.
 * Day 1 = Jumat, 27 November 2026
 * Day 2 = Sabtu, 28 November 2026
 * Day 3 = Minggu, 29 November 2026, dst.
 */
export function getDateForDayIndex(dayIndex: number): { date: Date; dateStr: string } {
  const base = getBaseEventDate();
  const target = new Date(base);
  target.setDate(base.getDate() + (dayIndex - 1));
  return {
    date: target,
    dateStr: formatIndoDate(target),
  };
}

export interface QuotaAllocation {
  scheduledDate: string;
  scheduledDayIndex: number;
  dailyOrderNumber: number;
  isRollover: boolean;
  currentDayOrdersCount: number;
  dayLabel: string;
}

/**
 * Calculates which day and queue number a NEW order should be allocated to.
 * Target: 25 orders per day.
 * If a day exceeds 25 orders, it automatically rolls over to the next day.
 */
export function calculateNextOrderAllocation(orders: Order[]): QuotaAllocation {
  const activeOrders = orders.filter((o) => o.status !== 'Dibatalkan');

  let dayIndex = 1;
  while (true) {
    const dayStartOrderIndex = (dayIndex - 1) * DAILY_ORDER_LIMIT;
    const dayEndOrderIndex = dayIndex * DAILY_ORDER_LIMIT;

    // Count orders allocated to this day
    const countForDay = activeOrders.filter((o, idx) => {
      if (o.scheduledDayIndex) {
        return o.scheduledDayIndex === dayIndex;
      }
      return idx >= dayStartOrderIndex && idx < dayEndOrderIndex;
    }).length;

    if (countForDay < DAILY_ORDER_LIMIT) {
      const { dateStr } = getDateForDayIndex(dayIndex);
      const isRollover = dayIndex > 1;
      return {
        scheduledDate: dateStr,
        scheduledDayIndex: dayIndex,
        dailyOrderNumber: countForDay + 1,
        isRollover,
        currentDayOrdersCount: countForDay,
        dayLabel: dayIndex === 1 ? 'Hari ke-1' : `Hari ke-${dayIndex} (Hari Selanjutnya)`,
      };
    }

    dayIndex++;
  }
}

export interface DayQuotaSummary {
  dayIndex: number;
  dateStr: string;
  count: number;
  limit: number;
  isFull: boolean;
  orders: Order[];
}

/**
 * Returns a day-by-day breakdown of orders and capacity for POS Admin & tracking.
 */
export function getDayQuotaSummaryList(orders: Order[]): DayQuotaSummary[] {
  const activeOrders = orders.filter((o) => o.status !== 'Dibatalkan');

  // Determine max day needed (at least 2 days shown)
  let maxDay = 2;
  activeOrders.forEach((o, idx) => {
    const assignedDay = o.scheduledDayIndex || Math.floor(idx / DAILY_ORDER_LIMIT) + 1;
    if (assignedDay > maxDay) {
      maxDay = assignedDay;
    }
  });

  const summaries: DayQuotaSummary[] = [];

  for (let d = 1; d <= maxDay; d++) {
    const { dateStr } = getDateForDayIndex(d);
    const dayStartOrderIndex = (d - 1) * DAILY_ORDER_LIMIT;
    const dayEndOrderIndex = d * DAILY_ORDER_LIMIT;

    const dayOrders = orders.filter((o, idx) => {
      if (o.scheduledDayIndex) {
        return o.scheduledDayIndex === d;
      }
      return idx >= dayStartOrderIndex && idx < dayEndOrderIndex;
    });

    const activeCount = dayOrders.filter((o) => o.status !== 'Dibatalkan').length;

    summaries.push({
      dayIndex: d,
      dateStr,
      count: activeCount,
      limit: DAILY_ORDER_LIMIT,
      isFull: activeCount >= DAILY_ORDER_LIMIT,
      orders: dayOrders,
    });
  }

  return summaries;
}
