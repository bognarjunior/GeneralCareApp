import type { Glycemia } from '@/repositories/glycemiaRepository';

export interface GlycemiaCardProps {
  item: Glycemia;
  onEdit: (g: Glycemia) => void;
  onDelete: (id: string) => void;
  testID?: string;
}
