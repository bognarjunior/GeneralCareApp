import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export type Appointment = {
  id: string;
  personId: string;
  dateISO: string;
  doctor?: string;
  specialty?: string;
  location?: string;
  notes?: string;
};

const keyFor = (personId: string) => `appointments:${personId}`;

export async function list(personId: string): Promise<Appointment[]> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  if (!raw) return [];
  const items = JSON.parse(raw) as Appointment[];
  return items.sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
}

async function saveAll(personId: string, items: Appointment[]) {
  await AsyncStorage.setItem(keyFor(personId), JSON.stringify(items));
}

export async function create(input: Omit<Appointment, 'id'>): Promise<Appointment> {
  const created: Appointment = { ...input, id: nanoid() };
  const items = await list(input.personId);
  await saveAll(input.personId, [created, ...items]);
  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<Appointment, 'id' | 'personId'>>,
): Promise<Appointment | null> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  const items: Appointment[] = raw ? JSON.parse(raw) : [];
  const idx = items.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Appointment = { ...items[idx], ...patch };
  const newList = [...items];
  newList[idx] = updated;
  await saveAll(personId, newList);
  return updated;
}

export async function remove(personId: string, id: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  const items: Appointment[] = raw ? JSON.parse(raw) : [];
  const newList = items.filter((a) => a.id !== id);
  const changed = newList.length !== items.length;
  if (changed) await saveAll(personId, newList);
  return changed;
}

export async function clearAll(personId: string) {
  await AsyncStorage.removeItem(keyFor(personId));
}
