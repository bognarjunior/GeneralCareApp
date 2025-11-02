import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type Filter = 'all' | 'today' | '7d' | '30d' | '90d';

function utcRangeFor(filter: Filter) {
  if (filter === 'all') return { start: 0, end: Number.MAX_SAFE_INTEGER };

  const now = new Date();
  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

  let start = new Date(end);
  if (filter === 'today') {
    start = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));
  } else {
    const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;
    start.setUTCDate(start.getUTCDate() - (days - 1));
    start.setUTCHours(0, 0, 0, 0);
  }

  return { start: start.getTime(), end: end.getTime() };
}

export interface DataItem {
  id: string;
  dateISO: string;
}

export interface RepositoryOperations<
  T extends DataItem,
  TCreate = Omit<T, 'id'>,
  TPatch = any
> {
  list: (personId: string) => Promise<T[]>;
  create: (input: TCreate) => Promise<T>;
  update: (personId: string, id: string, patch: TPatch) => Promise<T | null>;
  remove: (personId: string, id: string) => Promise<boolean>;
}

export interface UseFilteredPaginatedDataOptions<TExtra = Record<string, unknown>> {
  pageSize?: number;
  initialFilter?: Filter;
  extras?: TExtra;
}

export function useFilteredPaginatedData<
  T extends DataItem,
  TCreate = Omit<T, 'id'>,
  TPatch = any,
  TExtra = Record<string, unknown>
>(
  personId: string,
  repository: RepositoryOperations<T, TCreate, TPatch>,
  options: UseFilteredPaginatedDataOptions<TExtra> = {}
) {
  const { pageSize = 20, initialFilter = 'all', extras = {} as TExtra } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const repoRef = useRef(repository);
  useEffect(() => {
    repoRef.current = repository;
  }, [repository]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await repoRef.current.list(personId);
      list.sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
      setItems(list);
      setError(null);
      pageRef.current = 1;
      hasMoreRef.current = list.length > pageSize;
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [personId, pageSize]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: TCreate) => {
    const created = await repoRef.current.create(input);
    setItems(prev => [created, ...prev].sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1)));
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: TPatch) => {
    const updated = await repoRef.current.update(personId, id, patch);
    if (updated) {
      setItems(prev =>
        prev.map(m => (m.id === id ? updated : m)).sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1))
      );
    }
    return updated;
  }, [personId]);

  const remove = useCallback(async (id: string) => {
    const ok = await repoRef.current.remove(personId, id);
    if (ok) setItems(prev => prev.filter(m => m.id !== id));
    return ok;
  }, [personId]);

  const filtered = useMemo(() => {
    const { start, end } = utcRangeFor(filter);
    return items.filter(it => {
      const t = new Date(it.dateISO).getTime();
      return t >= start && t <= end;
    });
  }, [items, filter]);

  const paged = useMemo(() => {
    const slice = filtered.slice(0, pageSize * pageRef.current);
    hasMoreRef.current = slice.length < filtered.length;
    return slice;
  }, [filtered, pageSize]);

  const loadMore = useCallback(() => {
    if (hasMoreRef.current) pageRef.current += 1;
  }, []);

  const hasMore = hasMoreRef.current;

  return {
    items: paged,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    filter,
    setFilter,
    loadMore,
    hasMore,
    ...extras,
  };
}
