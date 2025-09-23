import { PersonScopedBase } from './_base';

export interface Medication extends PersonScopedBase {
  name: string;
  dosage?: string;
  scheduleTimes?: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

export type CreateMedicationInput = Omit<Medication,
  'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMedicationInput = Partial<Omit<Medication, 'personId'>> & { id: string };
