import type { Measurement } from '@/repositories/measurementsRepository';

export interface MeasurementCardProps {
  item: Measurement;
  onEdit: (m: Measurement) => void;
  onDelete: (id: string) => void;
  testID?: string;
}
