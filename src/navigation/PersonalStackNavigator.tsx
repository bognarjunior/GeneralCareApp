import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute, RouteProp } from '@react-navigation/native';

import PersonDetailScreen from '@/screens/PersonDetail';
import MedicationsScreen from '@/screens/Medications';
import BloodPressureScreen from '@/screens/BloodPressure';
import GlycemiaScreen from '@/screens/Glycemia';
import MeasurementsScreen from '@/screens/Measurements';
import AppointmentsScreen from '@/screens/Appointments';
import ChartsScreen from '@/screens/Charts';

import type { PersonStackParamList, RootStackParamList } from '@/navigation';

const Stack = createNativeStackNavigator<PersonStackParamList>();

type RootRouteProp = RouteProp<RootStackParamList, 'PersonDetailStack'>;

const PersonalStackNavigator = () => {
  const route = useRoute<RootRouteProp>();
  const { personId } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PersonDetail"
        component={PersonDetailScreen}
        initialParams={{ personId }}
      />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="BloodPressure" component={BloodPressureScreen} />
      <Stack.Screen name="Glycemia" component={GlycemiaScreen} />
      <Stack.Screen name="Measurements" component={MeasurementsScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="Charts" component={ChartsScreen} />
    </Stack.Navigator>
  );
};

export default PersonalStackNavigator;
