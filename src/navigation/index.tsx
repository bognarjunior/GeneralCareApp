import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/Home';
import MedicationsScreen from '@/screens/Medications';
import BloodPressureScreen from '@/screens/BloodPressure';
import GlycemiaScreen from '@/screens/Glycemia';
import PeopleListScreen from '@/screens/People/List';
import PersonFormScreen from '@/screens/People/Form';

export type RootStackParamList = {
  Home: undefined;
  PeopleList: undefined;
  PersonForm: undefined;
  Medications: undefined;
  BloodPressure: undefined;
  Glycemia: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Medications" component={MedicationsScreen} />
        <Stack.Screen name="BloodPressure" component={BloodPressureScreen} />
        <Stack.Screen name="Glycemia" component={GlycemiaScreen} />
        <Stack.Screen name="PeopleList" component={PeopleListScreen} />
        <Stack.Screen name="PersonForm" component={PersonFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
