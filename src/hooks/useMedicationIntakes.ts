import { useMemo } from 'react';
import { useFilteredPaginatedData, type Filter } from './useFilteredPaginatedData';
import * as repo from '@/repositories/medicationIntakesRepository';

export type { Filter };
export type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

export function useMedicationIntakes(personId: string) {
  const repoOps = useMemo(
    () => ({
      list: repo.list,
      create: repo.create,
      update: repo.update,
      remove: repo.remove,
    }),
    [],
  );

  return useFilteredPaginatedData<
    repo.MedicationIntake,
    Omit<repo.MedicationIntake, 'id'>,
    Partial<repo.MedicationIntake>,
    Record<string, never>
  >(personId, repoOps, { pageSize: 30, initialFilter: 'all' });
}
