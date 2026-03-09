import theme from '@/theme';
import { classify } from '@/repositories/bloodPressureRepository';

export function formatSummaryDate(dateISO: string): string {
  const d = new Date(dateISO);
  const now = new Date();
  const hhmm = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (d.toDateString() === now.toDateString()) return `Hoje, ${hhmm}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Ontem, ${hhmm}`;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function glycemiaStatusColor(value: number): string {
  if (value < 70 || value >= 140) return theme.colors.danger;
  if (value >= 100) return theme.colors.warning;
  return theme.colors.success;
}

export function bpStatusColor(systolic: number, diastolic: number): string {
  const c = classify(systolic, diastolic);
  if (c === 'normal') return theme.colors.success;
  if (c === 'hypertension_2') return theme.colors.danger;
  return theme.colors.warning;
}
