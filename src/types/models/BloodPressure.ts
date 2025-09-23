import { PersonScopedBase } from './_base';

export type BpPosture = 'sitting' | 'standing' | 'lying';

export interface BloodPressureRecord extends PersonScopedBase {
  systolic: number;
  diastolic: number;
  pulse?: number;
  measuredAt: string;
  posture?: BpPosture;
  notes?: string;
}

export type CreateBloodPressureInput = Omit<BloodPressureRecord,
  'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBloodPressureInput = Partial<Omit<BloodPressureRecord, 'personId'>> & { id: string };
