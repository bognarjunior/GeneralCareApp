import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { useMedicationIntakes } from './useMedicationIntakes';
import type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

const mockList = jest.fn<Promise<MedicationIntake[]>, [string]>();
const mockCreate = jest.fn<Promise<MedicationIntake>, [Omit<MedicationIntake, 'id'>]>();
const mockUpdate = jest.fn<Promise<MedicationIntake | null>, [string, string, Partial<MedicationIntake>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('@/repositories/medicationIntakesRepository', () => ({
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<MedicationIntake, 'id'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<MedicationIntake>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
}));

const mk = (id: string, dateISO = '2025-01-01T08:00:00.000Z'): MedicationIntake => ({
  id,
  personId: 'p1',
  medicationId: 'med-1',
  medicationName: 'Losartana',
  dateISO,
});

const PERSON_ID = 'p1';

function Probe({ personId }: { personId: string }) {
  const { items, loading, create, update, remove, filter, setFilter } = useMedicationIntakes(personId);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i: MedicationIntake) => i.id).join(',')}</Text>
      <Text testID="filter">{filter}</Text>
      <Text testID="set-today" onPress={() => setFilter('today')} />
      <Text testID="set-all" onPress={() => setFilter('all')} />
      <Text testID="create" onPress={() => create(mk('new', new Date().toISOString()))} />
      <Text testID="update" onPress={() => update('1', { notes: 'ok' })} />
      <Text testID="remove" onPress={() => remove('1')} />
    </>
  );
}

describe('useMedicationIntakes', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRemove.mockReset();
  });

  it('carrega itens ao montar ordenados por dateISO desc', async () => {
    mockList.mockResolvedValueOnce([
      mk('b', '2025-01-02T00:00:00.000Z'),
      mk('a', '2025-01-01T00:00:00.000Z'),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);

    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('ids').props.children).toBe('b,a');
    expect(mockList).toHaveBeenCalledWith(PERSON_ID);
  });

  it('expõe loading=true durante a busca e false após', async () => {
    let resolve: (v: MedicationIntake[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise(res => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });

  it('filtro padrão é "all" e exibe todos os itens', async () => {
    mockList.mockResolvedValueOnce([
      mk('old', '2020-01-01T00:00:00.000Z'),
      mk('new', '2025-06-01T00:00:00.000Z'),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('filter').props.children).toBe('all');
  });

  it('setFilter("today") filtra apenas itens de hoje', async () => {
    const now = new Date();
    const todayISO = now.toISOString();
    const oldISO = '2020-01-01T00:00:00.000Z';

    mockList.mockResolvedValueOnce([mk('today', todayISO), mk('old', oldISO)]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));

    await act(async () => { getByTestId('set-today').props.onPress(); });

    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(getByTestId('ids').props.children).toBe('today');
  });

  it('create() adiciona item à lista', async () => {
    const todayISO = new Date().toISOString();
    mockList.mockResolvedValueOnce([mk('1', '2025-01-01T00:00:00.000Z')]);
    mockCreate.mockResolvedValueOnce(mk('new', todayISO));

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
