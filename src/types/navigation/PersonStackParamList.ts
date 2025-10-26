export type PersonStackParamList = {
  PersonDetail: { personId: string };
  Medications: { personId: string };
  BloodPressure: { personId: string };
  Glycemia: { personId: string };
  Measurements: { personId: string };
  MeasurementsForm: { personId: string; preset?: any };
  Appointments: { personId: string };
  Charts: { personId: string };
};
