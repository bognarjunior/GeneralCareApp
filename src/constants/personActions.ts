export type PersonActionKey =
  | 'medications'
  | 'bloodPressure'
  | 'glycemia'
  | 'measurements'
  | 'appointments'
  | 'charts';

export type PersonAction = {
  key: PersonActionKey;
  label: string;
  iconName: string; 
  gradientKey: PersonActionKey;
  route:
    | 'Medications'
    | 'BloodPressure'
    | 'Glycemia'
    | 'Measurements'
    | 'Appointments'
    | 'Charts';
};

export const PERSON_ACTIONS: PersonAction[] = [
  {
    key: 'medications',
    label: 'Medicamentos',
    iconName: 'medical-services',
    gradientKey: 'medications',
    route: 'Medications',
  },
  {
    key: 'bloodPressure',
    label: 'Pressão Arterial',
    iconName: 'monitor-heart',
    gradientKey: 'bloodPressure',
    route: 'BloodPressure',
  },
  {
    key: 'glycemia',
    label: 'Glicemia',
    iconName: 'bloodtype',
    gradientKey: 'glycemia',
    route: 'Glycemia',
  },
  {
    key: 'measurements',
    label: 'Medidas (Peso / Altura)',
    iconName: 'view-timeline',
    gradientKey: 'measurements',
    route: 'Measurements',
  },
  {
    key: 'appointments',
    label: 'Consultas Médicas',
    iconName: 'event-note',
    gradientKey: 'appointments',
    route: 'Appointments',
  },
  {
    key: 'charts',
    label: 'Gráficos',
    iconName: 'insights',
    gradientKey: 'charts',
    route: 'Charts',
  },
];
