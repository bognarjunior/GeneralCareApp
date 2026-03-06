import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export type MedicationIntake = {
  id: string;
  personId: string;
  medicationId: string;
  medicationName: string;
  dateISO: string;
  scheduledTime?: string;
  notes?: string;
};

const keyFor = (personId: string) => `medication_intakes:${personId}`;

export async function list(personId: string): Promise<MedicationIntake[]> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  if (!raw) return [];
  const items = JSON.parse(raw) as MedicationIntake[];
  return items.sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
}

async function saveAll(personId: string, items: MedicationIntake[]) {
  await AsyncStorage.setItem(keyFor(personId), JSON.stringify(items));
}

export async function create(
  input: Omit<MedicationIntake, 'id'>,
): Promise<MedicationIntake> {
  const created: MedicationIntake = { ...input, id: nanoid() };
  const items = await list(input.personId);
  await saveAll(input.personId, [created, ...items]);
  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<MedicationIntake, 'id' | 'personId' | 'medicationId'>>,
): Promise<MedicationIntake | null> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  const items: MedicationIntake[] = raw ? JSON.parse(raw) : [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const updated: MedicationIntake = { ...items[idx], ...patch };
  const newList = [...items];
  newList[idx] = updated;
  await saveAll(personId, newList);
  return updated;
}

export async function remove(personId: string, id: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  const items: MedicationIntake[] = raw ? JSON.parse(raw) : [];
  const newList = items.filter((i) => i.id !== id);
  const changed = newList.length !== items.length;
  if (changed) await saveAll(personId, newList);
  return changed;
}

export async function clearAll(personId: string) {
  await AsyncStorage.removeItem(keyFor(personId));
}
