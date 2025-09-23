import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Person } from '@/types/models/Person';
import * as peopleRepo from '@/repositories/peopleRepository';

type NewPerson = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;
type PersonPatch = Partial<Omit<Person, 'id' | 'createdAt' | 'updatedAt'>>;

interface PeopleContextValue {
  people: Person[];
  loading: boolean;
  error: unknown;
  refresh: () => Promise<void>;
  createPerson: (input: NewPerson) => Promise<Person>;
  updatePerson: (id: string, patch: PersonPatch) => Promise<Person | null>;
  removePerson: (id: string) => Promise<boolean>;
  getPerson: (id: string) => Person | null;
  clearAll: () => Promise<void>;
}

const PeopleContext = createContext<PeopleContextValue | undefined>(undefined);

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await peopleRepo.list();
      setPeople(list);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createPerson = useCallback(async (input: NewPerson) => {
    const created = await peopleRepo.create(input);
    setPeople(prev => [...prev, created]);
    return created;
  }, []);

  const updatePerson = useCallback(async (id: string, patch: PersonPatch) => {
    const updated = await peopleRepo.update(id, patch);
    if (updated) {
      setPeople(prev => prev.map(p => (p.id === id ? updated : p)));
    }
    return updated;
  }, []);

  const removePerson = useCallback(async (id: string) => {
    const ok = await peopleRepo.remove(id);
    if (ok) setPeople(prev => prev.filter(p => p.id !== id));
    return ok;
  }, []);

  const getPerson = useCallback(
    (id: string) => people.find(p => p.id === id) ?? null,
    [people]
  );

  const clearAll = useCallback(async () => {
    await peopleRepo.clearAll();
    setPeople([]);
  }, []);

  const value = useMemo(
    () => ({
      people,
      loading,
      error,
      refresh,
      createPerson,
      updatePerson,
      removePerson,
      getPerson,
      clearAll,
    }),
    [people, loading, error, refresh, createPerson, updatePerson, removePerson, getPerson, clearAll]
  );

  return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
};

export function usePeople(): PeopleContextValue {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error('usePeople must be used within a PeopleProvider');
  return ctx;
}
