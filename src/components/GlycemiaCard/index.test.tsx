import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GlycemiaCard from './index';
import type { Glycemia } from '@/repositories/glycemiaRepository';

const mk = (overrides?: Partial<Glycemia>): Glycemia => ({
  id: 'g1',
  personId: 'p1',
  dateISO: '2025-03-01T08:00:00.000Z',
  valueMgDl: 95,
  ...overrides,
});

describe('GlycemiaCard', () => {
  it('renderiza sem erros', () => {
    const { getByTestId } = render(
      <GlycemiaCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByTestId('glycemia-card')).toBeTruthy();
  });

  it('exibe o valor em mg/dL', () => {
    const { getByText } = render(
      <GlycemiaCard item={mk({ valueMgDl: 110 })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText('110 mg/dL')).toBeTruthy();
  });

  it('exibe o label do contexto quando informado', () => {
    const { getByText } = render(
      <GlycemiaCard item={mk({ context: 'fasting' })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText('Jejum')).toBeTruthy();
  });

  it('exibe "Pós-prandial" para contexto postprandial', () => {
    const { getByText } = render(
      <GlycemiaCard item={mk({ context: 'postprandial' })} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByText('Pós-prandial')).toBeTruthy();
  });

  it('chama onEdit ao pressionar editar', () => {
    const item = mk();
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <GlycemiaCard item={item} onEdit={onEdit} onDelete={jest.fn()} />,
    );
    fireEvent.press(getByTestId('glycemia-card-edit'));
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it('chama onDelete com o id ao pressionar excluir', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <GlycemiaCard item={mk()} onEdit={jest.fn()} onDelete={onDelete} />,
    );
    fireEvent.press(getByTestId('glycemia-card-delete'));
    expect(onDelete).toHaveBeenCalledWith('g1');
  });
});
