import { parseDDMMYYYY } from '@/utils/date';
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

export function getAgeLabel(birthDate?: string): string | undefined {
  if (!birthDate) return undefined;
  const d = parseDDMMYYYY(birthDate);
  if (!d) return undefined;

  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const monthDiff = now.getMonth() - d.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d.getDate())) {
    age -= 1;
  }

  if (age < 0 || age > 130) return undefined;

  return `${age} ${age === 1 ? 'ano' : 'anos'}`;
}
