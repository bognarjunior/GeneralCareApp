import type { Appointment } from '@/repositories/appointmentsRepository';

export interface AppointmentCardProps {
  item: Appointment;
  onEdit: (item: Appointment) => void;
  onDelete: (id: string) => void;
  testID?: string;
}
