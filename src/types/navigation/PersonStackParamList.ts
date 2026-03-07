import type { RouteProp } from '@react-navigation/native';

export type PersonStackParamList = {
  PersonDetail: { personId: string };
  Medications: { personId: string };
  BloodPressure: { personId: string };
  Glycemia: { personId: string };
  Measurements: { personId: string };
  MeasurementsForm: { personId: string; preset?: unknown };
  Appointments: { personId: string };
  Charts: { personId: string };
  Dashboard: { personId: string };
};

export type PersonDetailRouteProps = RouteProp<PersonStackParamList, 'PersonDetail'>;
export type MedicationsRouteProps = RouteProp<PersonStackParamList, 'Medications'>;
export type BloodPressureRouteProps = RouteProp<PersonStackParamList, 'BloodPressure'>;
export type GlycemiaRouteProps = RouteProp<PersonStackParamList, 'Glycemia'>;
export type MeasurementsRouteProps = RouteProp<PersonStackParamList, 'Measurements'>;
export type AppointmentsRouteProps = RouteProp<PersonStackParamList, 'Appointments'>;
export type ChartsRouteProps = RouteProp<PersonStackParamList, 'Charts'>;
export type DashboardRouteProps = RouteProp<PersonStackParamList, 'Dashboard'>;
