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
jest.mock('@/hooks/useBloodPressure', () => ({
  useBloodPressure: () => ({ create: mockCreate, update: mockUpdate, items: [], loading: false }),
}));

import BloodPressureFormSheet from './index';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  personId: 'p1',
  preset: null,
  onSaved: jest.fn(),
};

describe('BloodPressureFormSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({});
    mockUpdate.mockResolvedValue({});
  });

  it('exibe título "Nova pressão arterial" quando não está editando', () => {
    const { getByText } = render(<BloodPressureFormSheet {...baseProps} />);
    expect(getByText('Nova pressão arterial')).toBeTruthy();
  });

  it('exibe título "Editar pressão arterial" quando está editando', () => {
    const preset = {
      id: 'bp1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      systolic: 120,
      diastolic: 80,
    };
    const { getByText } = render(<BloodPressureFormSheet {...baseProps} preset={preset} />);
    expect(getByText('Editar pressão arterial')).toBeTruthy();
  });

  it('renderiza os campos do formulário', () => {
    const { getByTestId } = render(<BloodPressureFormSheet {...baseProps} />);
    expect(getByTestId('bp-systolic')).toBeTruthy();
    expect(getByTestId('bp-diastolic')).toBeTruthy();
    expect(getByTestId('bp-pulse')).toBeTruthy();
    expect(getByTestId('bp-notes')).toBeTruthy();
  });

  it('chama create ao salvar com valores válidos', async () => {
    const { getByTestId, getByText } = render(<BloodPressureFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('bp-systolic'), '120');
    fireEvent.changeText(getByTestId('bp-diastolic'), '80');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ personId: 'p1', systolic: 120, diastolic: 80 }),
    ));
  });

  it('chama update ao salvar em modo edição', async () => {
    const preset = {
      id: 'bp1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      systolic: 120,
      diastolic: 80,
    };
    const { getByTestId, getByText } = render(<BloodPressureFormSheet {...baseProps} preset={preset} />);
    fireEvent.changeText(getByTestId('bp-systolic'), '130');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(
      'bp1',
      expect.objectContaining({ systolic: 130 }),
    ));
  });

  it('não chama create quando systólica está vazia', async () => {
    const { getByTestId, getByText } = render(<BloodPressureFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('bp-diastolic'), '80');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('chama onClose ao pressionar Cancelar', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<BloodPressureFormSheet {...baseProps} onClose={onClose} />);
    fireEvent.press(getByTestId('bp-cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
