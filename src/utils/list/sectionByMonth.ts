import { monthLabelFromYYYYMM } from '@/utils/date';

export type MonthSection<T> = {
  key: string;
  title: string;
  data: T[];
};

export function groupByMonth<T>(
  items: T[],
  getISO: (item: T) => string,
  monthLabel: (yyyyMm: string) => string = monthLabelFromYYYYMM
): MonthSection<T>[] {
  const map = new Map<string, T[]>();

  for (const it of items) {
    const d = new Date(getISO(it));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const arr = map.get(key) ?? [];
    arr.push(it);
    map.set(key, arr);
  }

  const months = Array.from(map.keys()).sort((a, b) => (a > b ? -1 : 1));

  return months.map((key) => {
    const monthItems = (map.get(key) ?? []).sort((a, b) => {
      const ia = getISO(a);
      const ib = getISO(b);
      return ia > ib ? -1 : ia < ib ? 1 : 0;
    });
    return { key, title: monthLabel(key), data: monthItems };
  });
}
