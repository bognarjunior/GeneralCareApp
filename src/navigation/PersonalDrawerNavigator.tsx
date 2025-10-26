import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute, RouteProp } from '@react-navigation/native';

import PersonDetailScreen from '@/screens/PersonDetail';
import MedicationsScreen from '@/screens/Medications';
import BloodPressureScreen from '@/screens/BloodPressure';
import GlycemiaScreen from '@/screens/Glycemia';
import MeasurementsScreen from '@/screens/Measurements';
import MeasurementsFormScreen from '@/screens/Measurements/Form';
import AppointmentsScreen from '@/screens/Appointments';
import ChartsScreen from '@/screens/Charts';

import type { PersonStackParamList, RootStackParamList } from '@/types/navigation';

const Drawer = createDrawerNavigator<PersonStackParamList>();

type RootRouteProp = RouteProp<RootStackParamList, 'PersonDetailStack'>;

const PersonalDrawerNavigator = () => {
  const route = useRoute<RootRouteProp>();
  const { personId } = route.params;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen
        name="PersonDetail"
        component={PersonDetailScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="Medications"
        component={MedicationsScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="BloodPressure"
        component={BloodPressureScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="Glycemia"
        component={GlycemiaScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="Measurements"
        component={MeasurementsScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="MeasurementsForm"
        component={MeasurementsFormScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="Appointments"
        component={AppointmentsScreen}
        initialParams={{ personId }}
      />
      <Drawer.Screen
        name="Charts"
        component={ChartsScreen}
        initialParams={{ personId }}
      />
    </Drawer.Navigator>
  );
};

export default PersonalDrawerNavigator;
