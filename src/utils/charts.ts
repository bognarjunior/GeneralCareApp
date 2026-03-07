import type { Glycemia } from '@/repositories/glycemiaRepository';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';
import type { Measurement } from '@/repositories/measurementsRepository';

export interface ChartPoint {
  value: number;
  label: string;
}

function formatDateLabel(dateISO: string): string {
  const d = new Date(dateISO);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function labelForIndex(index: number, total: number, dateISO: string): string {
  if (total <= 7) return formatDateLabel(dateISO);
  if (total <= 20 && index % 3 === 0) return formatDateLabel(dateISO);
  if (total <= 60 && index % 7 === 0) return formatDateLabel(dateISO);
  if (index % 14 === 0) return formatDateLabel(dateISO);
  return '';
}

export function toGlycemiaPoints(items: Glycemia[]): ChartPoint[] {
  return items.map((item, i) => ({
    value: item.valueMgDl,
    label: labelForIndex(i, items.length, item.dateISO),
  }));
}

export function toSystolicPoints(items: BloodPressure[]): ChartPoint[] {
  return items.map((item, i) => ({
    value: item.systolic,
    label: labelForIndex(i, items.length, item.dateISO),
  }));
}

export function toDiastolicPoints(items: BloodPressure[]): ChartPoint[] {
  return items.map((item) => ({
    value: item.diastolic,
    label: '',
  }));
}

export function toWeightPoints(items: Measurement[]): ChartPoint[] {
  return items.map((item, i) => ({
    value: item.weightKg,
    label: labelForIndex(i, items.length, item.dateISO),
  }));
}
