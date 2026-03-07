import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: 'LineChart',
}));

const mockHook = jest.fn();
jest.mock('@/hooks/useChartsData', () => ({
  useChartsData: (...args: unknown[]) => mockHook(...args),
}));

import ChartsScreen from './index';

const baseData = {
  glycemia: [],
  bloodPressure: [],
  measurements: [],
  loading: false,
};

describe('ChartsScreen', () => {
  beforeEach(() => {
    mockHook.mockReturnValue(baseData);
  });

  it('renderiza o header com título "Gráficos"', () => {
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('Gráficos')).toBeTruthy();
  });

  it('exibe seletor de período', () => {
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('1 mês')).toBeTruthy();
    expect(getByText('3 meses')).toBeTruthy();
    expect(getByText('6 meses')).toBeTruthy();
  });

  it('exibe seções de cada tipo de dado', () => {
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('Glicemia (mg/dL)')).toBeTruthy();
    expect(getByText('Pressão Arterial (mmHg)')).toBeTruthy();
    expect(getByText('Peso (kg)')).toBeTruthy();
  });

  it('exibe loader quando loading=true', () => {
    mockHook.mockReturnValue({ ...baseData, loading: true });
    const { UNSAFE_getByType } = render(<ChartsScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('muda o período ao pressionar chip', () => {
    const { getByText } = render(<ChartsScreen />);
    fireEvent.press(getByText('3 meses'));
    // Verifies re-render without error
    expect(mockHook).toHaveBeenCalledWith('p1', '90d');
  });

  it('chama useChartsData com o personId e período corretos', () => {
    render(<ChartsScreen />);
    expect(mockHook).toHaveBeenCalledWith('p1', '30d');
  });
});
