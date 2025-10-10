/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from '@/navigation/AppNavigator';
import { PeopleProvider } from '@/context/PeopleContext';
import theme from '@/theme';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <PeopleProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PeopleProvider>
    </GestureHandlerRootView>
  );
};

export default App;
