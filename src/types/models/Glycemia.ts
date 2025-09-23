import { PersonScopedBase } from './_base';

export type GlycemiaContext =
  | 'fasting'
  | 'preMeal'
  | 'postMeal'
  | 'bedtime'
  | 'random';

export interface GlycemiaRecord extends PersonScopedBase {
  value: number;
  measuredAt: string;
  context?: GlycemiaContext;
  notes?: string;
}

export type CreateGlycemiaInput = Omit<GlycemiaRecord,
  'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGlycemiaInput = Partial<Omit<GlycemiaRecord, 'personId'>> & { id: string };
