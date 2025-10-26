export function isValidDDMMYYYY(s?: string): boolean {
  if (!s) return true;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false;
  const [dd, mm, yyyy] = s.split('/').map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const valid =
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd;

  if (!valid) return false;
  const today = new Date();
  return date.getTime() <= today.getTime();
}

export function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function parseDDMMYYYY(s?: string): Date | null {
  if (!s) return null;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (
    d.getFullYear() !== Number(yyyy) ||
    d.getMonth() !== Number(mm) - 1 ||
    d.getDate() !== Number(dd)
  ) return null;
  return d;
}

export const MONTH_NAMES_PT = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro'
] as const;

export function monthLabelFromYYYYMM(yyyyMm: string, names = MONTH_NAMES_PT): string {
  const [y, mStr] = yyyyMm.split('-');
  const m = Math.max(1, Math.min(12, Number(mStr))) - 1;
  const month = names[m] ?? 'mês';
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${y}`;
}

export function yyyymmFromISO(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function dayKeyFromISO(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function formatHHmm(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function formatISOToDDMMYYYY_HHmm(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${formatDDMMYYYY(d)} ${formatHHmm(d)}`;
}

export function toISO(d: Date): string {
  return d.toISOString();
}
