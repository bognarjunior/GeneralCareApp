import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Picker = ({ children, testID }: any) =>
    React.createElement(View, { testID }, children);
  Picker.Item = ({ label }: any) => React.createElement(Text, null, label);
  return { Picker };
});

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/hooks/useMedicationIntakes', () => ({
  useMedicationIntakes: () => ({ create: mockCreate, update: mockUpdate, items: [], loading: false }),
}));

import IntakeFormSheet from './index';

const baseMedication = {
  id: 'med1',
  personId: 'p1',
  name: 'Losartana',
  scheduleTimes: [],
  isActive: true,
};

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  personId: 'p1',
  medication: baseMedication,
  preset: null,
  onSaved: jest.fn(),
};

describe('IntakeFormSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({});
    mockUpdate.mockResolvedValue({});
  });

  it('exibe título "Registrar tomada" quando não está editando', () => {
    const { getByText } = render(<IntakeFormSheet {...baseProps} />);
    expect(getByText('Registrar tomada')).toBeTruthy();
  });

  it('exibe título "Editar tomada" quando está editando', () => {
    const preset = {
      id: 'int1',
      personId: 'p1',
      medicationId: 'med1',
      medicationName: 'Losartana',
      dateISO: new Date().toISOString(),
    };
    const { getByText } = render(<IntakeFormSheet {...baseProps} preset={preset} />);
    expect(getByText('Editar tomada')).toBeTruthy();
  });

  it('exibe o nome do medicamento', () => {
    const { getByText } = render(<IntakeFormSheet {...baseProps} />);
    expect(getByText('Losartana')).toBeTruthy();
  });

  it('renderiza campo de observações', () => {
    const { getByTestId } = render(<IntakeFormSheet {...baseProps} />);
    expect(getByTestId('intake-notes')).toBeTruthy();
  });

  it('exibe o Picker de horário quando o medicamento tem scheduleTimes', () => {
    const medication = { ...baseMedication, scheduleTimes: ['08:00', '20:00'] };
    const { getByTestId } = render(<IntakeFormSheet {...baseProps} medication={medication} />);
    expect(getByTestId('intake-scheduled-time')).toBeTruthy();
  });

  it('não exibe o Picker de horário quando scheduleTimes está vazio', () => {
    const { queryByTestId } = render(<IntakeFormSheet {...baseProps} />);
    expect(queryByTestId('intake-scheduled-time')).toBeNull();
  });

  it('chama create ao registrar tomada', async () => {
    const { getByText } = render(<IntakeFormSheet {...baseProps} />);
    await act(async () => {
      fireEvent.press(getByText('Registrar'));
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ personId: 'p1', medicationId: 'med1', medicationName: 'Losartana' }),
    ));
  });

  it('chama update ao salvar em modo edição', async () => {
    const preset = {
      id: 'int1',
      personId: 'p1',
      medicationId: 'med1',
      medicationName: 'Losartana',
      dateISO: new Date().toISOString(),
    };
    const { getByTestId, getByText } = render(<IntakeFormSheet {...baseProps} preset={preset} />);
    fireEvent.changeText(getByTestId('intake-notes'), 'Com água');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(
      'int1',
      expect.objectContaining({ notes: 'Com água' }),
    ));
  });

  it('chama onClose ao pressionar Cancelar', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<IntakeFormSheet {...baseProps} onClose={onClose} />);
    fireEvent.press(getByTestId('intake-cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('não chama create quando medication é null', async () => {
    const { getByText } = render(<IntakeFormSheet {...baseProps} medication={null} />);
    await act(async () => {
      fireEvent.press(getByText('Registrar'));
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
