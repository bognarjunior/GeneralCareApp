import { useMemo } from 'react';
import { useFilteredPaginatedData, type Filter } from './useFilteredPaginatedData';
import * as repo from '@/repositories/appointmentsRepository';

export type { Filter };
export type { Appointment } from '@/repositories/appointmentsRepository';

export function useAppointments(personId: string) {
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
    repo.Appointment,
    Omit<repo.Appointment, 'id'>,
    Partial<repo.Appointment>,
    Record<string, never>
  >(personId, repoOps, { pageSize: 20, initialFilter: 'all' });
}
