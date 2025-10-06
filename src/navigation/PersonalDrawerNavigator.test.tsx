/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/screens/PersonDetail', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'PersonDetailScreen' }, 'PersonDetail');
});
jest.mock('@/screens/Medications', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'MedicationsScreen' }, 'Medications');
});
jest.mock('@/screens/BloodPressure', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'BloodPressureScreen' }, 'BloodPressure');
});
jest.mock('@/screens/Glycemia', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'GlycemiaScreen' }, 'Glycemia');
});
jest.mock('@/screens/Measurements', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'MeasurementsScreen' }, 'Measurements');
});
jest.mock('@/screens/Appointments', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'AppointmentsScreen' }, 'Appointments');
});
jest.mock('@/screens/Charts', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, { testID: 'ChartsScreen' }, 'Charts');
});

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: () => ({ params: { personId: 'p-123' } }),
  };
});

jest.mock('@react-navigation/drawer', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Screen = ({ name, component: Comp, initialParams }: any) =>
    React.createElement(
      View,
      { testID: `screen-${name}` },
      React.createElement(Text, { testID: `params-${name}` }, JSON.stringify(initialParams)),
      React.createElement(Comp, null)
    );

  const Navigator = ({ children, screenOptions }: any) =>
    React.createElement(View, { testID: 'drawer-navigator', screenOptions }, children);

  return {
    createDrawerNavigator: jest.fn(() => ({ Navigator, Screen })),
  };
});

import PersonalDrawerNavigator from './PersonalDrawerNavigator';

describe('PersonalDrawerNavigator', () => {
  it('propaga personId via initialParams para todas as telas', () => {
    const ui = render(<PersonalDrawerNavigator />);

    const names = [
      'PersonDetail',
      'Medications',
      'BloodPressure',
      'Glycemia',
      'Measurements',
      'Appointments',
      'Charts',
    ] as const;

    names.forEach((name) => {
      expect(ui.getByTestId(`screen-${name}`)).toBeTruthy();
      const paramsNode = ui.getByTestId(`params-${name}`);
      expect(paramsNode.props.children).toBe(JSON.stringify({ personId: 'p-123' }));
    });
  });

  it('usa screenOptions corretos (headerShown=false, drawerType=slide)', () => {
    const ui = render(<PersonalDrawerNavigator />);
    const nav = ui.getByTestId('drawer-navigator');
    const opts = nav.props.screenOptions || {};
    expect(opts.headerShown).toBe(false);
    expect(opts.drawerType).toBe('slide');
  });
});
