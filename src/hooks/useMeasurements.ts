import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as repo from '@/repositories/measurementsRepository';

type Filter = 'today' | '7d' | '30d' | '90d' | 'all';

function nowUtc(): Date {
  return new Date();
}
function minusDays(d: Date, n: number): Date {
  const t = new Date(d);
  t.setUTCDate(t.getUTCDate() - n);
  return t;
}
function yyyyMmFromISO(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
function isWithinFilter(iso: string, filter: Filter): boolean {
  if (filter === 'all') return true;
  const d = new Date(iso).getTime();
  const now = nowUtc().getTime();
  const inLast = (days: number) => d >= minusDays(new Date(now), days).getTime();

  switch (filter) {
    case 'today': {
      const today = new Date(nowUtc());
      const start = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(), 0, 0, 0
      )).getTime();
      const end = start + 24 * 60 * 60 * 1000;
      return d >= start && d < end;
    }
    case '7d':  return inLast(7);
    case '30d': return inLast(30);
    case '90d': return inLast(90);
    default:    return true;
  }
}

export function useMeasurements(personId: string) {
  const [items, setItems] = useState<repo.Measurement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const monthsRef = useRef<string[]>([]);
  const loadedMonthsRef = useRef<Set<string>>(new Set());
  const cursorRef = useRef<number>(0);
  const hasMoreRef = useRef<boolean>(false);
  const refreshEpochRef = useRef<number>(0);

  const resetPaging = useCallback(() => {
    monthsRef.current = [];
    loadedMonthsRef.current = new Set();
    cursorRef.current = 0;
    hasMoreRef.current = false;
    setItems([]);
  }, []);

  const loadIndex = useCallback(async () => {
    const idx = await repo.listMonths(personId);
    monthsRef.current = idx;
    cursorRef.current = 0;
  }, [personId]);

  const filterAllowsMonth = useCallback((yyyyMm: string): boolean => {
    if (filter === 'all') return true;
    const now = nowUtc();
    const limitDays =
      filter === 'today' ? 1  :
      filter === '7d'   ? 14 :
      filter === '30d'  ? 60 : 120;
    const limit = minusDays(now, limitDays);
    const ym = new Date(`${yyyyMm}-01T00:00:00.000Z`);
    return ym.getTime() >= Date.UTC(limit.getUTCFullYear(), limit.getUTCMonth(), 1, 0, 0, 0);
  }, [filter]);

  const appendNextMonth = useCallback(async (epoch: number): Promise<number> => {
    let added = 0;

    while (cursorRef.current < monthsRef.current.length) {
      if (epoch !== refreshEpochRef.current) return 0;

      const mon = monthsRef.current[cursorRef.current];
      cursorRef.current += 1;

      if (!filterAllowsMonth(mon)) continue;
      if (loadedMonthsRef.current.has(mon)) continue;

      const slice = await repo.listByMonth(personId, mon);
      const filtered = filter === 'all' ? slice : slice.filter(m => isWithinFilter(m.dateISO, filter));

      if (filtered.length > 0) {
        setItems(prev => [...prev, ...filtered].sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1)));
        added += filtered.length;
      }

      loadedMonthsRef.current.add(mon);
      break;
    }

    hasMoreRef.current = cursorRef.current < monthsRef.current.length;
    return added;
  }, [filter, personId, filterAllowsMonth]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const epoch = Date.now();
      refreshEpochRef.current = epoch;

      resetPaging();
      await loadIndex();

      let firstMonth: string | null = null;
      for (const mon of monthsRef.current) {
        if (filterAllowsMonth(mon)) { firstMonth = mon; break; }
        cursorRef.current += 1;
      }

      if (!firstMonth) {
        setItems([]);
        hasMoreRef.current = false;
        return;
      }

      const slice = await repo.listByMonth(personId, firstMonth);
      const filtered = filter === 'all' ? slice : slice.filter(m => isWithinFilter(m.dateISO, filter));

      if (epoch !== refreshEpochRef.current) return;

      setItems(filtered.sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1)));
      loadedMonthsRef.current.add(firstMonth);

      if (cursorRef.current === 0) cursorRef.current = 1;
      hasMoreRef.current = cursorRef.current < monthsRef.current.length;
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [filter, filterAllowsMonth, loadIndex, resetPaging, personId]);

  const loadMore = useCallback(async () => {
    if (!hasMoreRef.current || loading) return;
    setLoading(true);
    try {
      const epoch = refreshEpochRef.current;
      await appendNextMonth(epoch);
    } finally {
      setLoading(false);
    }
  }, [appendNextMonth, loading]);

  useEffect(() => {
    refresh();
  }, [refresh, personId]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const create = useCallback(async (input: Omit<repo.Measurement, 'id' | 'bmi'>) => {
    const created = await repo.create(input);

    if (isWithinFilter(created.dateISO, filter)) {
      setItems(prev => [created, ...prev].sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1)));
    }

    const mon = yyyyMmFromISO(created.dateISO);
    if (!monthsRef.current.includes(mon)) {
      monthsRef.current = [mon, ...monthsRef.current];
    }
    loadedMonthsRef.current.add(mon);

    return created;
  }, [filter]);

  const update = useCallback(async (id: string, patch: Parameters<typeof repo.update>[2]) => {
    const updated = await repo.update(personId, id, patch);
    if (!updated) return null;

    setItems(prev => {
      const next = prev.filter(m => m.id !== id);
      if (isWithinFilter(updated.dateISO, filter)) next.push(updated);
      return next.sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
    });

    return updated;
  }, [personId, filter]);

  const remove = useCallback(async (id: string) => {
    const ok = await repo.remove(personId, id);
    if (ok) setItems(prev => prev.filter(m => m.id !== id));
    return ok;
  }, [personId]);

  const hasMore = hasMoreRef.current;

  return useMemo(
    () => ({
      items,
      loading,
      error,
      refresh,
      create,
      update,
      remove,
      calcBMI: repo.calcBMI,

      filter,
      setFilter,
      loadMore,
      hasMore,
    }),
    [items, loading, error, refresh, create, update, remove, filter, setFilter, loadMore, hasMore]
  );
}
