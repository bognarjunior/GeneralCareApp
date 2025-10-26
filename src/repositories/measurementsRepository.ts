/* eslint-disable @typescript-eslint/no-shadow */
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

const INDEX_KEY = (personId: string) => `measurements:index:${personId}`;
const MONTH_KEY = (personId: string, yyyyMm: string) => `measurements:${personId}:${yyyyMm}`;

function ensureYYYYMM(iso: string): string {
  try {
    const d = new Date(iso);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  } catch {
    return String(iso).slice(0, 7);
  }
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const h = Math.max(0.01, heightCm) / 100;
  return Number((weightKg / (h * h)).toFixed(2));
}

async function loadIndex(personId: string): Promise<string[]> {
  const raw = await AsyncStorage.getItem(INDEX_KEY(personId));
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as string[];
    const uniq = Array.from(new Set(arr.filter(Boolean)));
    uniq.sort((a, b) => (a > b ? -1 : 1));
    return uniq;
  } catch {
    return [];
  }
}

async function saveIndex(personId: string, monthsDesc: string[]) {
  const uniq = Array.from(new Set(monthsDesc.filter(Boolean)));
  uniq.sort((a, b) => (a > b ? -1 : 1));
  await AsyncStorage.setItem(INDEX_KEY(personId), JSON.stringify(uniq));
}

async function loadMonth(personId: string, yyyyMm: string): Promise<Measurement[]> {
  const raw = await AsyncStorage.getItem(MONTH_KEY(personId, yyyyMm));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Measurement[];
  } catch {
    return [];
  }
}

async function saveMonth(personId: string, yyyyMm: string, items: Measurement[]) {
  await AsyncStorage.setItem(MONTH_KEY(personId, yyyyMm), JSON.stringify(items));
}

async function removeMonth(personId: string, yyyyMm: string) {
  await AsyncStorage.removeItem(MONTH_KEY(personId, yyyyMm));
}

export async function listMonths(personId: string): Promise<string[]> {
  return loadIndex(personId);
}

export async function listByMonth(personId: string, yyyyMm: string): Promise<Measurement[]> {
  const list = await loadMonth(personId, yyyyMm);
  return [...list].sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
}

export async function list(personId: string): Promise<Measurement[]> {
  const months = await loadIndex(personId);
  const all: Measurement[] = [];
  for (const mon of months) {
    const slice = await loadMonth(personId, mon);
    all.push(...slice);
  }
  return all.sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
}

export async function create(input: Omit<Measurement, 'id' | 'bmi'>): Promise<Measurement> {
  const month = ensureYYYYMM(input.dateISO);
  const id = nanoid();
  const created: Measurement = {
    ...input,
    id,
    bmi: calcBMI(input.weightKg, input.heightCm),
  };

  const items = await loadMonth(input.personId, month);
  const newMonth = [created, ...items].sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
  await saveMonth(input.personId, month, newMonth);

  const idx = await loadIndex(input.personId);
  if (!idx.includes(month)) {
    await saveIndex(input.personId, [month, ...idx]);
  }

  return created;
}

export async function update(
  personId: string,
  id: string,
  patch: Partial<Omit<Measurement, 'id' | 'personId' | 'bmi'>>,
): Promise<Measurement | null> {
  const idx = await loadIndex(personId);
  let foundMonth: string | null = null;
  let found: Measurement | null = null;

  for (const mon of idx) {
    const list = await loadMonth(personId, mon);
    const item = list.find((m) => m.id === id);
    if (item) {
      foundMonth = mon;
      found = item;
      break;
    }
  }

  if (!found || !foundMonth) return null;

  const base = found;
  const nextDateISO = patch.dateISO ?? base.dateISO;
  const targetMonth = ensureYYYYMM(nextDateISO);

  const weight = patch.weightKg ?? base.weightKg;
  const height = patch.heightCm ?? base.heightCm;
  const updated: Measurement = {
    ...base,
    ...patch,
    dateISO: nextDateISO,
    bmi: calcBMI(weight, height),
  };

  if (targetMonth === foundMonth) {
    const list = await loadMonth(personId, foundMonth);
    const newList = list.map((m) => (m.id === id ? updated : m)).sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
    await saveMonth(personId, foundMonth, newList);
    return updated;
  }

  const oldList = await loadMonth(personId, foundMonth);
  const newOld = oldList.filter((m) => m.id !== id);
  if (newOld.length === 0) {
    await removeMonth(personId, foundMonth);
    const newIdx = idx.filter((m) => m !== foundMonth);
    await saveIndex(personId, newIdx);
  } else {
    await saveMonth(personId, foundMonth, newOld);
  }

  const targetList = await loadMonth(personId, targetMonth);
  const newTarget = [updated, ...targetList].sort((a, b) => (a.dateISO > b.dateISO ? -1 : 1));
  await saveMonth(personId, targetMonth, newTarget);

  const newIdx2 = await loadIndex(personId);
  if (!newIdx2.includes(targetMonth)) {
    await saveIndex(personId, [targetMonth, ...newIdx2]);
  }

  return updated;
}

export async function remove(personId: string, id: string): Promise<boolean> {
  const idx = await loadIndex(personId);

  for (const mon of idx) {
    const list = await loadMonth(personId, mon);
    const newList = list.filter((m) => m.id !== id);
    if (newList.length !== list.length) {
      if (newList.length === 0) {
        await removeMonth(personId, mon);
        const newIdx = idx.filter((m) => m !== mon);
        await saveIndex(personId, newIdx);
      } else {
        await saveMonth(personId, mon, newList);
      }
      return true;
    }
  }
  return false;
}

export async function clearAll(personId: string) {
  const idx = await loadIndex(personId);
  for (const mon of idx) {
    await removeMonth(personId, mon);
  }
  await AsyncStorage.removeItem(INDEX_KEY(personId));
}
