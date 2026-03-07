import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: () => ({ create: mockCreate, update: mockUpdate, items: [], loading: false }),
}));

import AppointmentFormSheet from './index';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  personId: 'p1',
  preset: null,
  onSaved: jest.fn(),
};

describe('AppointmentFormSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({});
    mockUpdate.mockResolvedValue({});
  });

  it('exibe título "Nova Consulta" quando não está editando', () => {
    const { getByText } = render(<AppointmentFormSheet {...baseProps} />);
    expect(getByText('Nova Consulta')).toBeTruthy();
  });

  it('exibe título "Editar Consulta" quando está editando', () => {
    const preset = {
      id: 'apt1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      doctor: 'Dr. Silva',
    };
    const { getByText } = render(<AppointmentFormSheet {...baseProps} preset={preset} />);
    expect(getByText('Editar Consulta')).toBeTruthy();
  });

  it('renderiza os campos do formulário', () => {
    const { getByTestId } = render(<AppointmentFormSheet {...baseProps} />);
    expect(getByTestId('apt-doctor')).toBeTruthy();
    expect(getByTestId('apt-specialty')).toBeTruthy();
    expect(getByTestId('apt-location')).toBeTruthy();
    expect(getByTestId('apt-notes')).toBeTruthy();
  });

  it('chama create ao salvar', async () => {
    const { getByTestId, getByText } = render(<AppointmentFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('apt-doctor'), 'Dr. Costa');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ personId: 'p1', doctor: 'Dr. Costa' }),
    ));
  });

  it('chama update ao salvar em modo edição', async () => {
    const preset = {
      id: 'apt1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      doctor: 'Dr. Silva',
    };
    const { getByTestId, getByText } = render(<AppointmentFormSheet {...baseProps} preset={preset} />);
    fireEvent.changeText(getByTestId('apt-specialty'), 'Cardiologia');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(
      'apt1',
      expect.objectContaining({ specialty: 'Cardiologia' }),
    ));
  });

  it('chama onClose ao pressionar Cancelar', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<AppointmentFormSheet {...baseProps} onClose={onClose} />);
    fireEvent.press(getByTestId('apt-cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
