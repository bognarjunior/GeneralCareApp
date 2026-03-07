import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/hooks/useMedications', () => ({
  useMedications: () => ({ create: mockCreate, update: mockUpdate, items: [], loading: false }),
}));

import MedicationFormSheet from './index';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  personId: 'p1',
  preset: null,
  onSaved: jest.fn(),
};

describe('MedicationFormSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({});
    mockUpdate.mockResolvedValue({});
  });

  it('exibe título "Novo medicamento" quando não está editando', () => {
    const { getByText } = render(<MedicationFormSheet {...baseProps} />);
    expect(getByText('Novo medicamento')).toBeTruthy();
  });

  it('exibe título "Editar medicamento" quando está editando', () => {
    const preset = {
      id: 'med1',
      personId: 'p1',
      name: 'Losartana',
      scheduleTimes: [],
      isActive: true,
    };
    const { getByText } = render(<MedicationFormSheet {...baseProps} preset={preset} />);
    expect(getByText('Editar medicamento')).toBeTruthy();
  });

  it('renderiza os campos do formulário', () => {
    const { getByTestId } = render(<MedicationFormSheet {...baseProps} />);
    expect(getByTestId('med-name')).toBeTruthy();
    expect(getByTestId('med-dosage')).toBeTruthy();
    expect(getByTestId('med-time-input')).toBeTruthy();
    expect(getByTestId('med-notes')).toBeTruthy();
  });

  it('chama create ao salvar com nome válido', async () => {
    const { getByTestId, getByText } = render(<MedicationFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('med-name'), 'Losartana');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ personId: 'p1', name: 'Losartana' }),
    ));
  });

  it('não chama create quando nome está vazio', async () => {
    const { getByText } = render(<MedicationFormSheet {...baseProps} />);
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('chama update ao salvar em modo edição', async () => {
    const preset = {
      id: 'med1',
      personId: 'p1',
      name: 'Losartana',
      scheduleTimes: [],
      isActive: true,
    };
    const { getByTestId, getByText } = render(<MedicationFormSheet {...baseProps} preset={preset} />);
    fireEvent.changeText(getByTestId('med-dosage'), '50mg');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(
      'med1',
      expect.objectContaining({ dosage: '50mg' }),
    ));
  });

  it('adiciona horário ao pressionar o botão de adicionar', () => {
    const { getByTestId, getByText } = render(<MedicationFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('med-time-input'), '0800');
    fireEvent.press(getByTestId('med-time-add'));
    expect(getByText('08:00')).toBeTruthy();
  });

  it('remove horário ao pressionar remover', () => {
    const { getByTestId, getByText, queryByText } = render(<MedicationFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('med-time-input'), '0800');
    fireEvent.press(getByTestId('med-time-add'));
    expect(getByText('08:00')).toBeTruthy();
    fireEvent.press(getByTestId('med-time-remove-08:00'));
    expect(queryByText('08:00')).toBeNull();
  });

  it('chama onClose ao pressionar Cancelar', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<MedicationFormSheet {...baseProps} onClose={onClose} />);
    fireEvent.press(getByTestId('med-cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
