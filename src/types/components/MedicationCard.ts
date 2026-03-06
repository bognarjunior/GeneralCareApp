import type { Medication } from '@/repositories/medicationsRepository';
import type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

export interface MedicationCardProps {
  item: Medication;
  todayIntakes: MedicationIntake[];
  onEdit: (item: Medication) => void;
  onDelete: (id: string) => void;
  onLogIntake: (item: Medication) => void;
  onViewHistory: (item: Medication) => void;
  testID?: string;
}
