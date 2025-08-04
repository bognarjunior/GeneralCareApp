export type RootStackParamList = {
  Home: undefined;
  PeopleList: undefined;
  PeopleRegister: undefined;
  PersonDetailStack: {
    personId: string;
  };
};

export type PersonStackParamList = {
  PersonDetail: {
    personId: string;
  };
  Medications: { personId: string };
  BloodPressure: { personId: string };
  Glycemia: { personId: string };
  Measurements: { personId: string };
  Appointments: { personId: string };
  Charts: { personId: string };
};

export { default as AppNavigator } from './AppNavigator';
export { default as PersonalStackNavigator } from './PersonalStackNavigator';
