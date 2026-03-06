import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export type Medication = {
  id: string;
  personId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  dosage?: string;
  scheduleTimes: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
};

const keyFor = (personId: string) => `medications:${personId}`;

export async function list(personId: string): Promise<Medication[]> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  if (!raw) return [];
  const items = JSON.parse(raw) as Medication[];
  return items.sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return a.createdAt > b.createdAt ? -1 : 1;
  });
}

async function saveAll(personId: string, items: Medication[]) {
  await AsyncStorage.setItem(keyFor(personId), JSON.stringify(items));
}

export async function create(
  input: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Medication> {
  const now = new Date().toISOString();
  const created: Medication = { ...input, id: nanoid(), createdAt: now, updatedAt: now };
  const items = await list(input.personId);
  await saveAll(input.personId, [created, ...items]);
  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<Medication, 'id' | 'personId' | 'createdAt'>>,
): Promise<Medication | null> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  const items: Medication[] = raw ? JSON.parse(raw) : [];
  const idx = items.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  const updated: Medication = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
  const newList = [...items];
  newList[idx] = updated;
  await saveAll(personId, newList);
  return updated;
}

export async function remove(personId: string, id: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  const items: Medication[] = raw ? JSON.parse(raw) : [];
  const newList = items.filter((m) => m.id !== id);
  const changed = newList.length !== items.length;
  if (changed) await saveAll(personId, newList);
  return changed;
}

export async function clearAll(personId: string) {
  await AsyncStorage.removeItem(keyFor(personId));
}
