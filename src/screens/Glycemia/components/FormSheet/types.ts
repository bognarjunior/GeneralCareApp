import type { Glycemia } from '@/repositories/glycemiaRepository';

export interface GlycemiaFormSheetProps {
  visible: boolean;
  onClose: () => void;
  personId: string;
  preset?: Glycemia | null;
  onSaved: () => void;
}
