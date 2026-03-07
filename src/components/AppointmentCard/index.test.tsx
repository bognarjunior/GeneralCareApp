import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentCard from './index';
import type { Appointment } from '@/repositories/appointmentsRepository';

const mk = (overrides?: Partial<Appointment>): Appointment => ({
  id: 'a1',
  personId: 'p1',
  dateISO: '2025-06-15T10:30:00.000Z',
  ...overrides,
});

describe('AppointmentCard', () => {
  it('exibe a data formatada', () => {
    const { getByTestId } = render(
      <AppointmentCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(getByTestId('appointment-card')).toBeTruthy();
  });

  it('exibe médico e especialidade quando informados', () => {
    const { getByText } = render(
      <AppointmentCard
        item={mk({ doctor: 'Dr. João', specialty: 'Cardiologia' })}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText('Dr. João')).toBeTruthy();
    expect(getByText('Cardiologia')).toBeTruthy();
  });

  it('não exibe seção de médico quando não informado', () => {
    const { queryByText } = render(
      <AppointmentCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(queryByText('Dr.')).toBeNull();
  });

  it('exibe local quando informado', () => {
    const { getByText } = render(
      <AppointmentCard
        item={mk({ location: 'Hospital Central' })}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText(/Hospital Central/)).toBeTruthy();
  });

  it('exibe observações quando informadas', () => {
    const { getByText } = render(
      <AppointmentCard
        item={mk({ notes: 'Levar exames' })}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(getByText('Levar exames')).toBeTruthy();
  });

  it('chama onEdit com o item ao pressionar editar', () => {
    const item = mk({ doctor: 'Dr. Maria' });
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <AppointmentCard item={item} onEdit={onEdit} onDelete={jest.fn()} />,
    );
    fireEvent.press(getByTestId('appointment-card-edit'));
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it('chama onDelete com o id ao pressionar excluir', () => {
    const item = mk();
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <AppointmentCard item={item} onEdit={jest.fn()} onDelete={onDelete} />,
    );
    fireEvent.press(getByTestId('appointment-card-delete'));
    expect(onDelete).toHaveBeenCalledWith('a1');
  });

  it('usa testID customizado', () => {
    const { getByTestId } = render(
      <AppointmentCard item={mk()} onEdit={jest.fn()} onDelete={jest.fn()} testID="custom" />,
    );
    expect(getByTestId('custom')).toBeTruthy();
    expect(getByTestId('custom-edit')).toBeTruthy();
    expect(getByTestId('custom-delete')).toBeTruthy();
  });
});
