import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BloodPressureCard from './index';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';

const mk = (overrides?: Partial<BloodPressure>): BloodPressure => ({
  id: '1',
  personId: 'p1',
  dateISO: '2025-10-26T20:15:00.000Z',
  systolic: 120,
  diastolic: 80,
  ...overrides,
});

describe('BloodPressureCard', () => {
  it('exibe valor sistólica/diastólica e unidade', () => {
    const { getByText } = render(
      <BloodPressureCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText('120/80 mmHg')).toBeTruthy();
  });

  it('exibe label de classificação normal', () => {
    const { getByText } = render(
      <BloodPressureCard item={mk({ systolic: 110, diastolic: 70 })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText(/Normal/)).toBeTruthy();
  });

  it('exibe label de hypertension_2', () => {
    const { getByText } = render(
      <BloodPressureCard item={mk({ systolic: 150, diastolic: 95 })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText(/Hipertensão grau 2/)).toBeTruthy();
  });

  it('exibe pulso no meta quando fornecido', () => {
    const { getByText } = render(
      <BloodPressureCard item={mk({ pulse: 72 })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText(/72 bpm/)).toBeTruthy();
  });

  it('exibe braço esquerdo no meta quando arm=left', () => {
    const { getByText } = render(
      <BloodPressureCard item={mk({ arm: 'left' })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText(/Braço esquerdo/)).toBeTruthy();
  });

  it('exibe braço direito no meta quando arm=right', () => {
    const { getByText } = render(
      <BloodPressureCard item={mk({ arm: 'right' })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText(/Braço direito/)).toBeTruthy();
  });

  it('chama onEdit com o item ao pressionar editar', () => {
    const onEdit = jest.fn();
    const item = mk();
    const { getByTestId } = render(
      <BloodPressureCard item={item} onEdit={onEdit} onDelete={jest.fn()} />,
    );
    fireEvent.press(getByTestId('blood-pressure-card-edit'));
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it('chama onDelete com o id ao pressionar deletar', () => {
    const onDelete = jest.fn();
    const item = mk({ id: 'abc' });
    const { getByTestId } = render(
      <BloodPressureCard item={item} onEdit={jest.fn()} onDelete={onDelete} />,
    );
    fireEvent.press(getByTestId('blood-pressure-card-delete'));
    expect(onDelete).toHaveBeenCalledWith('abc');
  });

  it('respeita testID customizado', () => {
    const { getByTestId } = render(
      <BloodPressureCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} testID="bp-custom" />,
    );
    expect(getByTestId('bp-custom')).toBeTruthy();
  });
});
