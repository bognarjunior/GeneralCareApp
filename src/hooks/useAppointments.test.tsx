import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { useAppointments } from './useAppointments';
import type { Appointment } from '@/repositories/appointmentsRepository';

const mockList = jest.fn<Promise<Appointment[]>, [string]>();
const mockCreate = jest.fn<Promise<Appointment>, [Omit<Appointment, 'id'>]>();
const mockUpdate = jest.fn<Promise<Appointment | null>, [string, string, Partial<Appointment>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('@/repositories/appointmentsRepository', () => ({
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<Appointment, 'id'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<Appointment>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
}));

const mk = (id: string, dateISO = '2025-06-01T10:00:00.000Z'): Appointment => ({
  id,
  personId: 'p1',
  dateISO,
});

const PERSON_ID = 'p1';

function Probe({ personId }: { personId: string }) {
  const { items, loading, create, update, remove } = useAppointments(personId);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i: Appointment) => i.id).join(',')}</Text>
      <Text testID="create" onPress={() => create(mk('new', new Date().toISOString()))} />
      <Text testID="update" onPress={() => update('1', { notes: 'ok' })} />
      <Text testID="remove" onPress={() => remove('1')} />
    </>
  );
}

describe('useAppointments', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRemove.mockReset();
  });

  it('carrega itens ao montar e os expõe ordenados por data desc', async () => {
    mockList.mockResolvedValueOnce([
      mk('b', '2025-06-02T00:00:00.000Z'),
      mk('a', '2025-06-01T00:00:00.000Z'),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);

    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('ids').props.children).toBe('b,a');
    expect(mockList).toHaveBeenCalledWith(PERSON_ID);
  });

  it('expõe loading=true durante a busca e false após', async () => {
    let resolve: (v: Appointment[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise(res => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });

  it('create() adiciona item à lista', async () => {
    mockList.mockResolvedValueOnce([mk('1')]);
    mockCreate.mockResolvedValueOnce(mk('new', '2025-12-01T00:00:00.000Z'));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('create').props.onPress(); });

    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
  });

  it('update() substitui item na lista', async () => {
    mockList.mockResolvedValueOnce([mk('1')]);
    const updated = { ...mk('1'), notes: 'ok' };
    mockUpdate.mockResolvedValueOnce(updated);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('update').props.onPress(); });

    expect(mockUpdate).toHaveBeenCalledWith(PERSON_ID, '1', { notes: 'ok' });
  });

  it('remove() retira item da lista', async () => {
    mockList.mockResolvedValueOnce([mk('1'), mk('2')]);
    mockRemove.mockResolvedValueOnce(true);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));

    await act(async () => { getByTestId('remove').props.onPress(); });

    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(mockRemove).toHaveBeenCalledWith(PERSON_ID, '1');
  });
});
