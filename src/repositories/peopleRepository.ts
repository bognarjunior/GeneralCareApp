import { KEY_PEOPLE } from '@/storage/keys';
import { getJSON, setJSON } from '@/storage/async';
import type { Person } from '@/types/models/Person';

type NewPerson = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;
type PersonPatch = Partial<Omit<Person, 'id' | 'createdAt' | 'updatedAt'>>;

function nowISO(): string {
  return new Date().toISOString();
}

function genId(): string {
  try {
    const uuid = global?.crypto?.randomUUID?.();
    if (uuid) return uuid;
  } catch {}
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function readAll(): Promise<Person[]> {
  return (await getJSON<Person[]>(KEY_PEOPLE)) ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-shadow
async function writeAll(list: Person[]): Promise<void> {
  await setJSON<Person[]>(KEY_PEOPLE, list);
}

export async function list(): Promise<Person[]> {
  const all = await readAll();
  return all.slice().sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

export async function getById(id: string): Promise<Person | null> {
  const all = await readAll();
  return all.find(p => p.id === id) ?? null;
}

export async function create(input: NewPerson): Promise<Person> {
  const all = await readAll();
  const person: Person = {
    id: genId(),
    ...input,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  await writeAll([...all, person]);
  return person;
}

export async function update(id: string, patch: PersonPatch): Promise<Person | null> {
  const all = await readAll();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const updated: Person = { ...all[idx], ...patch, updatedAt: nowISO() };
  const next = all.slice();
  next[idx] = updated;
  await writeAll(next);
  return updated;
}

export async function upsert(person: Person): Promise<Person> {
  const all = await readAll();
  const idx = all.findIndex(p => p.id === person.id);

  const base: Person =
    idx === -1
      ? { ...person, createdAt: person.createdAt ?? nowISO() }
      : { ...all[idx], ...person };

  const entity: Person = { ...base, updatedAt: nowISO() };

  if (idx === -1) {
    await writeAll([...all, entity]);
  } else {
    const next = all.slice();
    next[idx] = entity;
    await writeAll(next);
  }
  return entity;
}

export async function remove(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter(p => p.id !== id);
  const changed = next.length !== all.length;
  if (changed) await writeAll(next);
  return changed;
}

export async function clearAll(): Promise<void> {
  await writeAll([]);
}
