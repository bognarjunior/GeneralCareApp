import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MeasurementCard from './index';
import type { Measurement } from '@/repositories/measurementsRepository';

const mk = (overrides?: Partial<Measurement>): Measurement => ({
  id: 'm1',
  personId: 'p1',
  dateISO: '2025-03-01T08:00:00.000Z',
  weightKg: 72.5,
  heightCm: 175,
  bmi: 23.67,
  ...overrides,
});

describe('MeasurementCard', () => {
  it('renderiza sem erros', () => {
    const { getByTestId } = render(
      <MeasurementCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByTestId('measurement-card')).toBeTruthy();
  });

  it('exibe o peso em kg', () => {
    const { getByText } = render(
      <MeasurementCard item={mk({ weightKg: 72.5 })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText('72.5 kg')).toBeTruthy();
  });

  it('exibe altura e IMC como metaLeft', () => {
    const { getByText } = render(
      <MeasurementCard item={mk({ heightCm: 175, bmi: 23.67 })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText('175 cm • IMC 23.67')).toBeTruthy();
  });

  it('chama onEdit ao pressionar editar', () => {
    const item = mk();
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <MeasurementCard item={item} onEdit={onEdit} onDelete={jest.fn()} />,
    );
    fireEvent.press(getByTestId('measurement-card-edit'));
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it('chama onDelete com o id ao pressionar excluir', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <MeasurementCard item={mk()} onEdit={jest.fn()} onDelete={onDelete} />,
    );
    fireEvent.press(getByTestId('measurement-card-delete'));
    expect(onDelete).toHaveBeenCalledWith('m1');
  });

  it('aceita testID customizado', () => {
    const { getByTestId } = render(
      <MeasurementCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} testID="custom-measurement" />,
    );
    expect(getByTestId('custom-measurement')).toBeTruthy();
    expect(getByTestId('custom-measurement-edit')).toBeTruthy();
    expect(getByTestId('custom-measurement-delete')).toBeTruthy();
  });
});
