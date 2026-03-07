import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const mockHook = jest.fn();
jest.mock('@/hooks/useBloodPressure', () => ({
  useBloodPressure: (...args: unknown[]) => mockHook(...args),
}));

jest.mock('./components/FormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'form-sheet' }) : null;
});

import BloodPressureScreen from './index';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';

const baseHook = {
  items: [] as BloodPressure[],
  loading: false,
  refresh: jest.fn(),
  remove: jest.fn(),
  filter: 'all' as const,
  setFilter: jest.fn(),
  loadMore: jest.fn(),
  hasMore: false,
};

describe('BloodPressureScreen', () => {
  beforeEach(() => {
    mockHook.mockReturnValue(baseHook);
  });

  it('renderiza o header com título "Pressão Arterial"', () => {
    const { getByText } = render(<BloodPressureScreen />);
    expect(getByText('Pressão Arterial')).toBeTruthy();
  });

  it('exibe estado vazio quando não há itens', () => {
    const { getByText } = render(<BloodPressureScreen />);
    expect(getByText('Nenhuma medição cadastrada.')).toBeTruthy();
  });

  it('exibe loader quando loading=true e lista vazia', () => {
    mockHook.mockReturnValue({ ...baseHook, loading: true });
    const { UNSAFE_getByType } = render(<BloodPressureScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar o botão de adicionar', () => {
    const { getByTestId } = render(<BloodPressureScreen />);
    fireEvent.press(getByTestId('bp-open-create'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar "Adicionar" no estado vazio', () => {
    const { getByTestId } = render(<BloodPressureScreen />);
    fireEvent.press(getByTestId('bp-empty-add'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('chama useBloodPressure com o personId correto', () => {
    render(<BloodPressureScreen />);
    expect(mockHook).toHaveBeenCalledWith('p1');
  });
});
