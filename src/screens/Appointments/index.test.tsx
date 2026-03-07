import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const mockHook = jest.fn();
jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: (...args: unknown[]) => mockHook(...args),
}));

jest.mock('./components/AppointmentFormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'form-sheet' }) : null;
});

import AppointmentsScreen from './index';
import type { Appointment } from '@/repositories/appointmentsRepository';

const baseHook = {
  items: [] as Appointment[],
  loading: false,
  refresh: jest.fn(),
  remove: jest.fn(),
  filter: 'all' as const,
  setFilter: jest.fn(),
  loadMore: jest.fn(),
  hasMore: false,
};

describe('AppointmentsScreen', () => {
  beforeEach(() => {
    mockHook.mockReturnValue(baseHook);
  });

  it('renderiza o header com título "Consultas"', () => {
    const { getByText } = render(<AppointmentsScreen />);
    expect(getByText('Consultas')).toBeTruthy();
  });

  it('exibe estado vazio quando não há itens', () => {
    const { getByText } = render(<AppointmentsScreen />);
    expect(getByText('Nada encontrado neste período.')).toBeTruthy();
  });

  it('exibe loader quando loading=true e lista vazia', () => {
    mockHook.mockReturnValue({ ...baseHook, loading: true });
    const { UNSAFE_getByType } = render(<AppointmentsScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar o botão de adicionar', () => {
    const { getByTestId } = render(<AppointmentsScreen />);
    fireEvent.press(getByTestId('apt-open-create'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar "Adicionar" no estado vazio', () => {
    const { getByTestId } = render(<AppointmentsScreen />);
    fireEvent.press(getByTestId('apt-empty-add'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('chama useAppointments com o personId correto', () => {
    render(<AppointmentsScreen />);
    expect(mockHook).toHaveBeenCalledWith('p1');
  });
});
