import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export type Measurement = {
  id: string;
  personId: string;
  dateISO: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  notes?: string;
};

const keyFor = (personId: string) => `measurements:${personId}`;

export async function list(personId: string): Promise<Measurement[]> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  return raw ? (JSON.parse(raw) as Measurement[]) : [];
}

async function saveAll(personId: string, items: Measurement[]) {
  await AsyncStorage.setItem(keyFor(personId), JSON.stringify(items));
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const h = Math.max(0.01, heightCm) / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}

export async function create(input: Omit<Measurement, 'id' | 'bmi'>): Promise<Measurement> {
  const items = await list(input.personId);
  const created: Measurement = {
    ...input,
    id: nanoid(),
    bmi: calcBMI(input.weightKg, input.heightCm),
  };
  await saveAll(input.personId, [created, ...items]);
  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<Measurement, 'id' | 'personId' | 'bmi'>>,
): Promise<Measurement | null> {
  const items = await list(personId);
  const idx = items.findIndex(m => m.id === id);
  if (idx === -1) return null;

  const base = items[idx];
  const next = {
    ...base,
    ...patch,
  };
  const weight = patch.weightKg ?? base.weightKg;
  const height = patch.heightCm ?? base.heightCm;
  next.bmi = calcBMI(weight, height);

  const newList = [...items];
  newList[idx] = next;
  await saveAll(personId, newList);
  return next;
}

export async function remove(personId: string, id: string): Promise<boolean> {
  const items = await list(personId);
  const newList = items.filter(m => m.id !== id);
  const changed = newList.length !== items.length;
  if (changed) await saveAll(personId, newList);
  return changed;
}

export async function clearAll(personId: string) {
  await AsyncStorage.removeItem(keyFor(personId));
}
