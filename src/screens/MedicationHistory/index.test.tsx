import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { personId: 'p1', medicationId: 'med1', medicationName: 'Losartana' },
  }),
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Picker = ({ children, testID }: any) =>
    React.createElement(View, { testID }, children);
  Picker.Item = ({ label }: any) => React.createElement(Text, null, label);
  return { Picker };
});

const mockRemove = jest.fn();
const mockSetFilter = jest.fn();
const mockLoadMore = jest.fn();
const mockRefresh = jest.fn();

const mockIntakes = [
  {
    id: 'int1',
    personId: 'p1',
    medicationId: 'med1',
    medicationName: 'Losartana',
    dateISO: '2025-03-01T08:00:00.000Z',
  },
];

let mockUseMedicationIntakes = {
  items: [] as typeof mockIntakes,
  loading: false,
  hasMore: false,
  filter: 'all' as const,
  setFilter: mockSetFilter,
  loadMore: mockLoadMore,
  refresh: mockRefresh,
  remove: mockRemove,
  create: jest.fn(),
  update: jest.fn(),
};

jest.mock('@/hooks/useMedicationIntakes', () => ({
  useMedicationIntakes: () => mockUseMedicationIntakes,
}));

jest.mock('@/screens/Medications/components/IntakeFormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'intake-sheet' }) : null;
});

import MedicationHistoryScreen from './index';

describe('MedicationHistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMedicationIntakes = {
      ...mockUseMedicationIntakes,
      items: [],
      loading: false,
    };
  });

  it('exibe o nome do medicamento no header', () => {
    const { getByText } = render(<MedicationHistoryScreen />);
    expect(getByText('Losartana')).toBeTruthy();
  });

  it('exibe estado vazio quando não há tomadas', () => {
    const { getByText } = render(<MedicationHistoryScreen />);
    expect(getByText('Nenhuma tomada registrada neste período.')).toBeTruthy();
  });

  it('exibe ActivityIndicator quando está carregando', () => {
    mockUseMedicationIntakes = { ...mockUseMedicationIntakes, loading: true };
    const { UNSAFE_getByType } = render(<MedicationHistoryScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('exibe os filtros de período', () => {
    const { getByTestId } = render(<MedicationHistoryScreen />);
    expect(getByTestId('history-filters')).toBeTruthy();
  });

  it('exibe tomada quando há dados para o medicationId correto', () => {
    mockUseMedicationIntakes = { ...mockUseMedicationIntakes, items: mockIntakes };
    const { getByTestId } = render(<MedicationHistoryScreen />);
    expect(getByTestId('history-card')).toBeTruthy();
  });

  it('não exibe tomada de outro medicamento', () => {
    const otherIntake = { ...mockIntakes[0], id: 'int2', medicationId: 'other-med' };
    mockUseMedicationIntakes = { ...mockUseMedicationIntakes, items: [otherIntake] };
    const { getByText, queryByTestId } = render(<MedicationHistoryScreen />);
    expect(queryByTestId('history-card')).toBeNull();
    expect(getByText('Nenhuma tomada registrada neste período.')).toBeTruthy();
  });

  it('chama remove ao pressionar excluir', () => {
    mockUseMedicationIntakes = { ...mockUseMedicationIntakes, items: mockIntakes };
    const { getByTestId } = render(<MedicationHistoryScreen />);
    fireEvent.press(getByTestId('history-delete'));
    expect(mockRemove).toHaveBeenCalledWith('int1');
  });

  it('abre o IntakeFormSheet ao pressionar editar', () => {
    mockUseMedicationIntakes = { ...mockUseMedicationIntakes, items: mockIntakes };
    const { getByTestId, queryByTestId } = render(<MedicationHistoryScreen />);
    expect(queryByTestId('intake-sheet')).toBeNull();
    fireEvent.press(getByTestId('history-edit'));
    expect(getByTestId('intake-sheet')).toBeTruthy();
  });
});
