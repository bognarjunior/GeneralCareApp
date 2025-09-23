import { PersonScopedBase } from './_base';

export interface BodyMeasurement extends PersonScopedBase {
  measuredAt: string;
  weightKg?: number;
  heightCm?: number;
  waistCm?: number;
  notes?: string;
}

export type CreateBodyMeasurementInput = Omit<BodyMeasurement,
  'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBodyMeasurementInput = Partial<Omit<BodyMeasurement, 'personId'>> & { id: string };
