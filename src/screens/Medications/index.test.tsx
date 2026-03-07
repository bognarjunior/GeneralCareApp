import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockNavigate = jest.fn();
const mockGetParent = jest.fn(() => ({ navigate: jest.fn() }));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn(), getParent: mockGetParent }),
}));

const mockMeds = jest.fn();
const mockIntakes = jest.fn();
jest.mock('@/hooks/useMedications', () => ({
  useMedications: (...args: unknown[]) => mockMeds(...args),
}));
jest.mock('@/hooks/useMedicationIntakes', () => ({
  useMedicationIntakes: (...args: unknown[]) => mockIntakes(...args),
}));

jest.mock('./components/MedicationFormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'med-form-sheet' }) : null;
});

jest.mock('./components/IntakeFormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'intake-form-sheet' }) : null;
});

import MedicationsScreen from './index';
import type { Medication } from '@/repositories/medicationsRepository';

const baseMeds = {
  items: [] as Medication[],
  loading: false,
  refresh: jest.fn(),
  remove: jest.fn(),
  filter: 'all' as const,
  setFilter: jest.fn(),
  loadMore: jest.fn(),
  hasMore: false,
};

const baseIntakes = {
  items: [],
  loading: false,
  refresh: jest.fn(),
  setFilter: jest.fn(),
  filter: 'today' as const,
  loadMore: jest.fn(),
  hasMore: false,
};

describe('MedicationsScreen', () => {
  beforeEach(() => {
    mockMeds.mockReturnValue(baseMeds);
    mockIntakes.mockReturnValue(baseIntakes);
  });

  it('renderiza o header com título "Medicamentos"', () => {
    const { getByText } = render(<MedicationsScreen />);
    expect(getByText('Medicamentos')).toBeTruthy();
  });

  it('exibe estado vazio quando não há medicamentos', () => {
    const { getByText } = render(<MedicationsScreen />);
    expect(getByText('Nenhum medicamento cadastrado.')).toBeTruthy();
  });

  it('exibe loader quando loading=true e lista vazia', () => {
    mockMeds.mockReturnValue({ ...baseMeds, loading: true });
    const { UNSAFE_getByType } = render(<MedicationsScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('abre MedicationFormSheet ao pressionar o botão adicionar', () => {
    const { getByTestId } = render(<MedicationsScreen />);
    fireEvent.press(getByTestId('med-open-create'));
    expect(getByTestId('med-form-sheet')).toBeTruthy();
  });

  it('abre MedicationFormSheet ao pressionar "Adicionar" no estado vazio', () => {
    const { getByTestId } = render(<MedicationsScreen />);
    fireEvent.press(getByTestId('med-empty-add'));
    expect(getByTestId('med-form-sheet')).toBeTruthy();
  });

  it('chama useMedications e useMedicationIntakes com o personId correto', () => {
    render(<MedicationsScreen />);
    expect(mockMeds).toHaveBeenCalledWith('p1');
    expect(mockIntakes).toHaveBeenCalledWith('p1');
  });
});
