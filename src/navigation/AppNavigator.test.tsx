/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import AppNavigator from './AppNavigator';

jest.mock('@/screens/Home', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const { useNavigation } = require('@react-navigation/native');
  return function MockHome() {
    const navigation = useNavigation();
    return React.createElement(
      View,
      null,
      React.createElement(Text, { testID: 'home-title' }, 'Home'),
      React.createElement(
        TouchableOpacity,
        { testID: 'go-people', onPress: () => navigation.navigate('PeopleList') },
        React.createElement(Text, null, 'Ir para lista')
      )
    );
  };
});

jest.mock('@/screens/People/List', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockPeopleList() {
    return React.createElement(
      View,
      null,
      React.createElement(Text, { testID: 'people-list-title' }, 'Lista')
    );
  };
});

jest.mock('@/screens/People/Form', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockPeopleForm() {
    return React.createElement(View, null, React.createElement(Text, null, 'Form'));
  };
});

jest.mock('./PersonalDrawerNavigator', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockDrawer() {
    return React.createElement(View, null, React.createElement(Text, null, 'Drawer'));
  };
});

describe('AppNavigator + header customizado', () => {
  it('mostra o header "GeneralApp" em PeopleList e o botão de voltar navega para Home', async () => {
    const navRef = createNavigationContainerRef();

    const ui = render(
      <NavigationContainer ref={navRef}>
        <AppNavigator />
      </NavigationContainer>
    );
    expect(ui.getByTestId('home-title')).toBeTruthy();
    await act(async () => {
      await Promise.resolve();
      navRef.navigate('PeopleList' as never);
    });

    await waitFor(() => expect(ui.getByTestId('people-list-title')).toBeTruthy());
    await waitFor(() => expect(ui.getByTestId('app-header')).toBeTruthy());
    expect(ui.getByText('GeneralApp')).toBeTruthy();

    const backBtn = ui.getByTestId('icon-button');
    fireEvent.press(backBtn);

    await waitFor(() => expect(ui.getByTestId('home-title')).toBeTruthy());
  });
});
