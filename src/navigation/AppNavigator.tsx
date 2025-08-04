import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/Home';
import PeopleListScreen from '@/screens/People/List';
import PeopleFormScreen from '@/screens/People/Form';
import PersonalDrawerNavigator from './PersonalDrawerNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PeopleList" component={PeopleListScreen} />
    <Stack.Screen name="PeopleRegister" component={PeopleFormScreen} />
    <Stack.Screen name="PersonDetailStack" component={PersonalDrawerNavigator} />
  </Stack.Navigator>
);

export default AppNavigator;
