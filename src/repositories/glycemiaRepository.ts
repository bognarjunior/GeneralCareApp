import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export type GlycemiaContext =
  | 'fasting'
  | 'preprandial'
  | 'postprandial'
  | 'random'
  | 'bedtime';

export type Glycemia = {
  id: string;
  personId: string;
  dateISO: string;
  valueMgDl: number;
  context?: GlycemiaContext;
  notes?: string;
};

const keyFor = (personId: string) => `glycemia:${personId}`;

export async function list(personId: string): Promise<Glycemia[]> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  return raw ? (JSON.parse(raw) as Glycemia[]) : [];
}

async function saveAll(personId: string, items: Glycemia[]) {
  await AsyncStorage.setItem(keyFor(personId), JSON.stringify(items));
}

function ensureValidValue(valueMgDl: number) {
  if (!Number.isFinite(valueMgDl)) {
    throw new Error('Valor de glicemia inválido.');
  }
  if (valueMgDl < 0 || valueMgDl > 2000) {
    throw new Error('A glicemia deve estar entre 0 e 2000 mg/dL.');
  }
}

export async function create(input: Omit<Glycemia, 'id'>): Promise<Glycemia> {
  ensureValidValue(input.valueMgDl);

  const items = await list(input.personId);
  const created: Glycemia = {
    ...input,
    id: nanoid(),
  };
  await saveAll(input.personId, [created, ...items]);
  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<Glycemia, 'id' | 'personId'>>,
): Promise<Glycemia | null> {
  const items = await list(personId);
  const idx = items.findIndex((g) => g.id === id);
  if (idx === -1) return null;

  const base = items[idx];
  const next: Glycemia = { ...base, ...patch };

  if (patch.valueMgDl !== undefined) {
    ensureValidValue(next.valueMgDl);
  }

  const newList = [...items];
  newList[idx] = next;
  await saveAll(personId, newList);
  return next;
}
export async function remove(personId: string, id: string): Promise<boolean> {
  const items = await list(personId);
  const newList = items.filter((g) => g.id !== id);
  const changed = newList.length !== items.length;
  if (changed) await saveAll(personId, newList);
  return changed;
}
export async function clearAll(personId: string) {
  await AsyncStorage.removeItem(keyFor(personId));
}
