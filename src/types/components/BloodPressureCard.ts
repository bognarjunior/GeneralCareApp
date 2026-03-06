import type { BloodPressure } from '@/repositories/bloodPressureRepository';

export interface BloodPressureCardProps {
  item: BloodPressure;
  onEdit: (item: BloodPressure) => void;
  onDelete: (id: string) => void;
  testID?: string;
}
