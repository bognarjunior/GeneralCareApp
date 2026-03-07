import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const mockHook = jest.fn();
jest.mock('@/hooks/useMeasurements', () => ({
  useMeasurements: (...args: unknown[]) => mockHook(...args),
}));

jest.mock('./components/FormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'form-sheet' }) : null;
});

import MeasurementsScreen from './index';
import type { Measurement } from '@/repositories/measurementsRepository';

const baseHook = {
  items: [] as Measurement[],
  loading: false,
  refresh: jest.fn(),
  remove: jest.fn(),
  filter: 'all' as const,
  setFilter: jest.fn(),
  loadMore: jest.fn(),
  hasMore: false,
  calcBMI: jest.fn(),
};

describe('MeasurementsScreen', () => {
  beforeEach(() => {
    mockHook.mockReturnValue(baseHook);
  });

  it('renderiza o header com título "Medições"', () => {
    const { getByText } = render(<MeasurementsScreen />);
    expect(getByText('Medições')).toBeTruthy();
  });

  it('exibe estado vazio quando não há itens', () => {
    const { getByText } = render(<MeasurementsScreen />);
    expect(getByText('Nenhuma medição cadastrada.')).toBeTruthy();
  });

  it('exibe loader quando loading=true e lista vazia', () => {
    mockHook.mockReturnValue({ ...baseHook, loading: true });
    const { UNSAFE_getByType } = render(<MeasurementsScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar o botão de adicionar', () => {
    const { getByTestId } = render(<MeasurementsScreen />);
    fireEvent.press(getByTestId('m-open-create'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar "Adicionar" no estado vazio', () => {
    const { getByTestId } = render(<MeasurementsScreen />);
    fireEvent.press(getByTestId('m-empty-add'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('chama useMeasurements com o personId correto', () => {
    render(<MeasurementsScreen />);
    expect(mockHook).toHaveBeenCalledWith('p1');
  });
});
