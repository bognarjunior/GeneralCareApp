import { useMemo } from 'react';
import { useFilteredPaginatedData, type Filter } from './useFilteredPaginatedData';
import * as repo from '@/repositories/bloodPressureRepository';

export type { Filter };

export function useBloodPressure(personId: string) {
  const repoOps = useMemo(() => ({
    list: repo.list,
    create: repo.create,
    update: repo.update,
    remove: repo.remove,
  }), []);

  return useFilteredPaginatedData<
    repo.BloodPressure,
    Omit<repo.BloodPressure, 'id'>,
    Partial<repo.BloodPressure>,
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
