import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: mockGoBack }),
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

  it('renderiza sem erros quando há dados de glicemia', () => {
    const glycemia = [
      { id: 'g1', personId: 'p1', dateISO: '2025-03-01T08:00:00.000Z', valueMgDl: 95 },
      { id: 'g2', personId: 'p1', dateISO: '2025-03-02T08:00:00.000Z', valueMgDl: 110 },
    ];
    mockHook.mockReturnValue({ ...baseData, glycemia });
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('Glicemia (mg/dL)')).toBeTruthy();
  });

  it('renderiza sem erros quando há dados de pressão arterial', () => {
    const bloodPressure = [
      { id: 'bp1', personId: 'p1', dateISO: '2025-03-01T08:00:00.000Z', systolic: 120, diastolic: 80 },
      { id: 'bp2', personId: 'p1', dateISO: '2025-03-02T08:00:00.000Z', systolic: 130, diastolic: 85 },
    ];
    mockHook.mockReturnValue({ ...baseData, bloodPressure });
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('Pressão Arterial (mmHg)')).toBeTruthy();
  });

  it('renderiza sem erros quando há dados de peso', () => {
    const measurements = [
      { id: 'm1', personId: 'p1', dateISO: '2025-03-01T08:00:00.000Z', weightKg: 72, heightCm: 175, bmi: 23.5 },
    ];
    mockHook.mockReturnValue({ ...baseData, measurements });
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('Peso (kg)')).toBeTruthy();
  });

  it('renderiza dados com muitos pontos (exercita labelForIndex)', () => {
    const glycemia = Array.from({ length: 25 }, (_, i) => ({
      id: `g${i}`,
      personId: 'p1',
      dateISO: new Date(2025, 0, i + 1).toISOString(),
      valueMgDl: 90 + i,
    }));
    mockHook.mockReturnValue({ ...baseData, glycemia });
    const { getByText } = render(<ChartsScreen />);
    expect(getByText('Glicemia (mg/dL)')).toBeTruthy();
  });

  it('muda para 6 meses ao pressionar chip', () => {
    const { getByText } = render(<ChartsScreen />);
    fireEvent.press(getByText('6 meses'));
    expect(mockHook).toHaveBeenCalledWith('p1', '180d');
  });

  it('chama goBack ao pressionar voltar', () => {
    const { getByTestId } = render(<ChartsScreen />);
    fireEvent.press(getByTestId('icon-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

});
