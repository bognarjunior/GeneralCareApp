import { useMemo } from 'react';
import { useFilteredPaginatedData, type Filter } from './useFilteredPaginatedData';
import * as repo from '@/repositories/glycemiaRepository';

export type { Filter };

export function useGlycemia(personId: string) {
  const repoOps = useMemo(() => ({
    list: repo.list,
    create: repo.create,
    update: repo.update,
    remove: repo.remove,
  }), []);

  return useFilteredPaginatedData<
    repo.Glycemia,
    Omit<repo.Glycemia, 'id'>,
    Partial<repo.Glycemia>,
    Record<string, never>
  >(
    personId,
    repoOps,
    {
      pageSize: 20,
      initialFilter: 'all',
    }
  );
}
