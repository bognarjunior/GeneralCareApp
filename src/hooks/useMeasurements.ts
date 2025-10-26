import { useCallback, useEffect, useMemo, useState } from 'react';
import * as repo from '@/repositories/measurementsRepository';

export function useMeasurements(personId: string) {
  const [items, setItems] = useState<repo.Measurement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await repo.list(personId);
      setItems(list);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: Omit<repo.Measurement, 'id' | 'bmi'>) => {
    const created = await repo.create(input);
    setItems(prev => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Parameters<typeof repo.update>[2]) => {
    const updated = await repo.update(personId, id, patch);
    if (updated) setItems(prev => prev.map(m => (m.id === id ? updated : m)));
    return updated;
  }, [personId]);

  const remove = useCallback(async (id: string) => {
    const ok = await repo.remove(personId, id);
    if (ok) setItems(prev => prev.filter(m => m.id !== id));
    return ok;
  }, [personId]);

  return useMemo(
    () => ({ items, loading, error, refresh, create, update, remove, calcBMI: repo.calcBMI }),
    [items, loading, error, refresh, create, update, remove],
  );
}
