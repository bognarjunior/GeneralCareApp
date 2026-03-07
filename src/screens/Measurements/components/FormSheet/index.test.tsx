import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockCalcBMI = jest.fn((w: number, h: number) => Number((w / ((h / 100) ** 2)).toFixed(2)));

jest.mock('@/hooks/useMeasurements', () => ({
  useMeasurements: () => ({
    create: mockCreate,
    update: mockUpdate,
    calcBMI: mockCalcBMI,
    items: [],
    loading: false,
  }),
}));

import MeasurementFormSheet from './index';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  personId: 'p1',
  preset: null,
  onSaved: jest.fn(),
};

describe('MeasurementFormSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({});
    mockUpdate.mockResolvedValue({});
  });

  it('exibe título "Nova medição" quando não está editando', () => {
    const { getByText } = render(<MeasurementFormSheet {...baseProps} />);
    expect(getByText('Nova medição')).toBeTruthy();
  });

  it('exibe título "Editar medição" quando está editando', () => {
    const preset = {
      id: 'm1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      weightKg: 70,
      heightCm: 170,
      bmi: 24.22,
    };
    const { getByText } = render(<MeasurementFormSheet {...baseProps} preset={preset} />);
    expect(getByText('Editar medição')).toBeTruthy();
  });

  it('renderiza os campos do formulário', () => {
    const { getByTestId } = render(<MeasurementFormSheet {...baseProps} />);
    expect(getByTestId('m-weight')).toBeTruthy();
    expect(getByTestId('m-height')).toBeTruthy();
    expect(getByTestId('m-notes')).toBeTruthy();
  });

  it('exibe IMC estimado quando peso e altura são informados', () => {
    const { getByTestId, getByText } = render(<MeasurementFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('m-weight'), '70');
    fireEvent.changeText(getByTestId('m-height'), '170');
    expect(mockCalcBMI).toHaveBeenCalledWith(70, 170);
    expect(getByText(/IMC estimado:/)).toBeTruthy();
  });

  it('exibe "—" para IMC quando campos estão vazios', () => {
    const { getByText } = render(<MeasurementFormSheet {...baseProps} />);
    expect(getByText('IMC estimado: —')).toBeTruthy();
  });

  it('chama create ao salvar com valores válidos', async () => {
    const { getByTestId, getByText } = render(<MeasurementFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('m-weight'), '70');
    fireEvent.changeText(getByTestId('m-height'), '170');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ personId: 'p1', weightKg: 70, heightCm: 170 }),
    ));
  });

  it('chama update ao salvar em modo edição', async () => {
    const preset = {
      id: 'm1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      weightKg: 70,
      heightCm: 170,
      bmi: 24.22,
    };
    const { getByTestId, getByText } = render(<MeasurementFormSheet {...baseProps} preset={preset} />);
    fireEvent.changeText(getByTestId('m-weight'), '75');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(
      'm1',
      expect.objectContaining({ weightKg: 75 }),
    ));
  });

  it('não chama create quando peso/altura estão vazios', async () => {
    const { getByText } = render(<MeasurementFormSheet {...baseProps} />);
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('chama onClose ao pressionar Cancelar', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<MeasurementFormSheet {...baseProps} onClose={onClose} />);
    fireEvent.press(getByTestId('m-cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
