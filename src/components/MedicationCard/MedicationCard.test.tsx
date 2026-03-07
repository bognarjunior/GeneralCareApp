import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MedicationCard from './index';
import type { Medication } from '@/repositories/medicationsRepository';
import type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

jest.mock('@/components/CustomText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCustomText(props: any) {
    return React.createElement(Text, props, props.children);
  };
});

jest.mock('@/components/IconButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return function MockIconButton(props: any) {
    return React.createElement(
      Pressable,
      { onPress: props.onPress, testID: props.testID },
      React.createElement(Text, null, props.iconName),
    );
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const React = require('react');
  return function MockIcon(props: any) {
    return React.createElement('Icon', props, null);
  };
});

const mkMed = (overrides?: Partial<Medication>): Medication => ({
  id: 'med-1',
  personId: 'p1',
  name: 'Losartana',
  dosage: '50mg',
  scheduleTimes: ['08:00', '20:00'],
  isActive: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

const mkIntake = (overrides?: Partial<MedicationIntake>): MedicationIntake => ({
  id: 'intake-1',
  personId: 'p1',
  medicationId: 'med-1',
  medicationName: 'Losartana',
  dateISO: new Date().toISOString(),
  scheduledTime: '08:00',
  ...overrides,
});

describe('MedicationCard', () => {
  const defaultProps = {
    item: mkMed(),
    todayIntakes: [],
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onLogIntake: jest.fn(),
    onViewHistory: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('renderiza nome e dosagem do medicamento', () => {
    const { getByText } = render(<MedicationCard {...defaultProps} />);
    expect(getByText('Losartana')).toBeTruthy();
    expect(getByText('50mg')).toBeTruthy();
  });

  it('exibe badge "Ativo" para medicamento ativo', () => {
    const { getByText } = render(<MedicationCard {...defaultProps} />);
    expect(getByText('Ativo')).toBeTruthy();
  });

  it('exibe badge "Inativo" para medicamento inativo', () => {
    const { getByText } = render(
      <MedicationCard {...defaultProps} item={mkMed({ isActive: false })} />,
    );
    expect(getByText('Inativo')).toBeTruthy();
  });

  it('mostra horários resumidos quando recolhido', () => {
    const { getByText } = render(<MedicationCard {...defaultProps} />);
    expect(getByText('08:00 • 20:00')).toBeTruthy();
  });

  it('expande ao tocar no header e mostra ações', () => {
    const { getByTestId, queryByTestId } = render(
      <MedicationCard {...defaultProps} testID="med-card" />,
    );

    expect(queryByTestId('med-card-log')).toBeNull();

    fireEvent.press(getByTestId('med-card-toggle'));

    expect(getByTestId('med-card-log')).toBeTruthy();
    expect(getByTestId('med-card-history')).toBeTruthy();
    expect(getByTestId('med-card-edit')).toBeTruthy();
    expect(getByTestId('med-card-delete')).toBeTruthy();
  });

  it('recolhe ao tocar novamente no header', () => {
    const { getByTestId, queryByTestId } = render(
      <MedicationCard {...defaultProps} testID="med-card" />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));
    expect(getByTestId('med-card-log')).toBeTruthy();

    fireEvent.press(getByTestId('med-card-toggle'));
    expect(queryByTestId('med-card-log')).toBeNull();
  });

  it('mostra status de tomada por horário quando expandido', () => {
    const intake = mkIntake({ scheduledTime: '08:00' });
    const { getByTestId, getByText } = render(
      <MedicationCard {...defaultProps} todayIntakes={[intake]} testID="med-card" />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));

    expect(getByText('08:00')).toBeTruthy();
  });

  it('chama onLogIntake ao tocar em "Registrar tomada"', () => {
    const onLogIntake = jest.fn();
    const { getByTestId } = render(
      <MedicationCard {...defaultProps} onLogIntake={onLogIntake} testID="med-card" />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));
    fireEvent.press(getByTestId('med-card-log'));

    expect(onLogIntake).toHaveBeenCalledWith(defaultProps.item);
  });

  it('chama onViewHistory ao tocar em "Ver histórico"', () => {
    const onViewHistory = jest.fn();
    const { getByTestId } = render(
      <MedicationCard {...defaultProps} onViewHistory={onViewHistory} testID="med-card" />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));
    fireEvent.press(getByTestId('med-card-history'));

    expect(onViewHistory).toHaveBeenCalledWith(defaultProps.item);
  });

  it('chama onEdit com o item ao tocar no botão de edição', () => {
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <MedicationCard {...defaultProps} onEdit={onEdit} testID="med-card" />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));
    fireEvent.press(getByTestId('med-card-edit'));

    expect(onEdit).toHaveBeenCalledWith(defaultProps.item);
  });

  it('chama onDelete com o id ao tocar no botão de exclusão', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <MedicationCard {...defaultProps} onDelete={onDelete} testID="med-card" />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));
    fireEvent.press(getByTestId('med-card-delete'));

    expect(onDelete).toHaveBeenCalledWith('med-1');
  });

  it('não exibe lista de horários quando scheduleTimes está vazio', () => {
    const { getByTestId, queryByText } = render(
      <MedicationCard
        {...defaultProps}
        item={mkMed({ scheduleTimes: [] })}
        testID="med-card"
      />,
    );

    fireEvent.press(getByTestId('med-card-toggle'));

    expect(queryByText('08:00')).toBeNull();
    expect(queryByText('20:00')).toBeNull();
  });
});
