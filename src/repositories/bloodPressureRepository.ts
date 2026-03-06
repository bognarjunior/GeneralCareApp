import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export type BloodPressureArm = 'left' | 'right';

export type BloodPressureClassification =
  | 'normal'
  | 'elevated'
  | 'hypertension_1'
  | 'hypertension_2';

export type BloodPressure = {
  id: string;
  personId: string;
  dateISO: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  arm?: BloodPressureArm;
  notes?: string;
};

const keyFor = (personId: string) => `blood_pressure:${personId}`;

export function classify(systolic: number, diastolic: number): BloodPressureClassification {
  if (systolic >= 140 || diastolic >= 90) return 'hypertension_2';
  if (systolic >= 130 || diastolic >= 80) return 'hypertension_1';
  if (systolic >= 120 && diastolic < 80) return 'elevated';
  return 'normal';
}

function ensureValidValues(systolic: number, diastolic: number) {
  if (!Number.isFinite(systolic) || systolic < 0 || systolic > 300) {
    throw new Error('Valor sistólico inválido.');
  }
  if (!Number.isFinite(diastolic) || diastolic < 0 || diastolic > 200) {
    throw new Error('Valor diastólico inválido.');
  }
}

export async function list(personId: string): Promise<BloodPressure[]> {
  const raw = await AsyncStorage.getItem(keyFor(personId));
  return raw ? (JSON.parse(raw) as BloodPressure[]) : [];
}

async function saveAll(personId: string, items: BloodPressure[]) {
  await AsyncStorage.setItem(keyFor(personId), JSON.stringify(items));
}

export async function create(input: Omit<BloodPressure, 'id'>): Promise<BloodPressure> {
  ensureValidValues(input.systolic, input.diastolic);

  const items = await list(input.personId);
  const created: BloodPressure = { ...input, id: nanoid() };
  await saveAll(input.personId, [created, ...items]);
  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<BloodPressure, 'id' | 'personId'>>,
): Promise<BloodPressure | null> {
  const items = await list(personId);
  const idx = items.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const next: BloodPressure = { ...items[idx], ...patch };

  if (patch.systolic !== undefined || patch.diastolic !== undefined) {
    ensureValidValues(next.systolic, next.diastolic);
  }

  const newList = [...items];
  newList[idx] = next;
  await saveAll(personId, newList);
  return next;
}

export async function remove(personId: string, id: string): Promise<boolean> {
  const items = await list(personId);
  const newList = items.filter((b) => b.id !== id);
  const changed = newList.length !== items.length;
  if (changed) await saveAll(personId, newList);
  return changed;
}

export async function clearAll(personId: string) {
  await AsyncStorage.removeItem(keyFor(personId));
}
