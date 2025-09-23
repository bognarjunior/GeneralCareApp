import { PersonScopedBase } from './_base';

export type AppointmentStatus = 'scheduled' | 'done' | 'cancelled';

export interface Appointment extends PersonScopedBase {
  title: string;
  dateTime: string;
  doctor?: string;
  specialty?: string;
  location?: string;
  status: AppointmentStatus;
  reminderMinutesBefore?: number;
  notes?: string;
}

export type CreateAppointmentInput = Omit<Appointment,
  'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAppointmentInput = Partial<Omit<Appointment, 'personId'>> & { id: string };
