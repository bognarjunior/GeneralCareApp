import type { VitalsFilterValue } from '@/types/components/VitalsFilters';

function startOfDayLocal(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDayLocal(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function rangeFromVitalsFilter(
  filter: VitalsFilterValue,
): { from: Date | null; to: Date | null } {
  if (filter === 'all') return { from: null, to: null };

  const now = new Date();
  const todayStart = startOfDayLocal(now);
  const todayEnd = endOfDayLocal(now);

  if (filter === 'today') return { from: todayStart, to: todayEnd };

  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;
  const from = new Date(todayStart);
  from.setDate(from.getDate() - (days - 1));
  return { from, to: todayEnd };
}

export function isInRangeLocal(iso: string, from: Date | null, to: Date | null): boolean {
  if (!from && !to) return true;
  const d = new Date(iso);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}
