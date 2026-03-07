import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  PeopleList: undefined;
  PersonDetailStack: {
    personId: string;
  };
  PeopleRegister?: { personId?: string };
  MedicationHistory: {
    personId: string;
    medicationId: string;
    medicationName: string;
  };
};

export type MedicationHistoryRouteProps = RouteProp<RootStackParamList, 'MedicationHistory'>;
