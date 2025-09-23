import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/navigation/AppNavigator';
import { PeopleProvider } from '@/context/PeopleContext';

const App = () => {
  return (
    <PeopleProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PeopleProvider>
  );
};

export default App;
