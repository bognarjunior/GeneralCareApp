import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

export type RootStackNavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type PeopleListNavigationProps = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;
export type PeopleRegisterRouteProps = RouteProp<RootStackParamList, 'PeopleRegister'>;
export type MedicationHistoryRouteProps = RouteProp<RootStackParamList, 'MedicationHistory'>;
