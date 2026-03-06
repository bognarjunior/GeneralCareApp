import { useCallback, useEffect, useState } from 'react';
import * as repo from '@/repositories/medicationsRepository';
import type { Medication } from '@/repositories/medicationsRepository';

export type { Medication };

export function useMedications(personId: string) {
  const [items, setItems] = useState<Medication[]>([]);
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

  const create = useCallback(
    async (input: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = await repo.create(input);
      setItems((prev) => {
        const next = [created, ...prev];
        return next.sort((a, b) => {
          if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
          return a.createdAt > b.createdAt ? -1 : 1;
        });
      });
      return created;
    },
    [],
  );

  const update = useCallback(
    async (
      id: string,
      patch: Partial<Omit<Medication, 'id' | 'personId' | 'createdAt'>>,
    ) => {
      const updated = await repo.update(personId, id, patch);
      if (updated) {
        setItems((prev) => {
          const next = prev.map((m) => (m.id === id ? updated : m));
          return next.sort((a, b) => {
            if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
            return a.createdAt > b.createdAt ? -1 : 1;
          });
        });
      }
      return updated;
    },
    [personId],
  );

  const remove = useCallback(
    async (id: string) => {
      const ok = await repo.remove(personId, id);
      if (ok) setItems((prev) => prev.filter((m) => m.id !== id));
      return ok;
    },
    [personId],
  );

  const toggle = useCallback(
    async (id: string) => {
      const item = items.find((m) => m.id === id);
      if (!item) return null;
      return update(id, { isActive: !item.isActive });
    },
    [items, update],
  );

  return { items, loading, error, refresh, create, update, remove, toggle };
}
