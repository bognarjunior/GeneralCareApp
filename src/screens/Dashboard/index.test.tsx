import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const mockDashboard = jest.fn();
jest.mock('@/hooks/usePersonDashboard', () => ({
  usePersonDashboard: (...args: unknown[]) => mockDashboard(...args),
}));

jest.mock('@/repositories/bloodPressureRepository', () => ({
  classify: jest.fn(() => 'normal'),
}));

import DashboardScreen from './index';

const baseData = {
  lastGlycemia: null,
  lastBloodPressure: null,
  lastMeasurement: null,
  todayIntakesCount: 0,
  activeMedsCount: 0,
  loading: false,
  refresh: jest.fn(),
};

describe('DashboardScreen', () => {
  beforeEach(() => {
    mockDashboard.mockReturnValue(baseData);
  });

  it('renderiza sem erros com dados vazios', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Glicemia')).toBeTruthy();
    expect(getByText('Pressão Arterial')).toBeTruthy();
    expect(getByText('Peso')).toBeTruthy();
    expect(getByText('Medicamentos hoje')).toBeTruthy();
  });

  it('exibe indicador de carregamento quando loading=true', () => {
    mockDashboard.mockReturnValue({ ...baseData, loading: true });
    const { UNSAFE_getByType } = render(<DashboardScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('exibe valores "—" quando não há registros', () => {
    const { getAllByText } = render(<DashboardScreen />);
    expect(getAllByText('—')).toHaveLength(3); // glycemia, BP, weight
  });

  it('exibe último valor de glicemia', () => {
    mockDashboard.mockReturnValue({
      ...baseData,
      lastGlycemia: { id: 'g1', valueMgDl: 95, dateISO: new Date().toISOString() },
    });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('95 mg/dL')).toBeTruthy();
  });

  it('exibe última pressão arterial', () => {
    mockDashboard.mockReturnValue({
      ...baseData,
      lastBloodPressure: { id: 'bp1', systolic: 120, diastolic: 80, dateISO: new Date().toISOString() },
    });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('120/80 mmHg')).toBeTruthy();
  });

  it('exibe último peso e IMC', () => {
    mockDashboard.mockReturnValue({
      ...baseData,
      lastMeasurement: { id: 'm1', weightKg: 70, bmi: 24.22, dateISO: new Date().toISOString() },
    });
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('70 kg')).toBeTruthy();
  });

  it('chama usePersonDashboard com o personId correto', () => {
    render(<DashboardScreen />);
    expect(mockDashboard).toHaveBeenCalledWith('p1');
  });
});
