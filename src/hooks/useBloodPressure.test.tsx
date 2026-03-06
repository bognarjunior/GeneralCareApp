import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { useBloodPressure } from './useBloodPressure';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';

const mockList = jest.fn<Promise<BloodPressure[]>, [string]>();
const mockCreate = jest.fn<Promise<BloodPressure>, [Omit<BloodPressure, 'id'>]>();
const mockUpdate = jest.fn<Promise<BloodPressure | null>, [string, string, Partial<BloodPressure>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('@/repositories/bloodPressureRepository', () => ({
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<BloodPressure, 'id'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<BloodPressure>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
}));

const mk = (id: string, dateISO = '2025-01-01T08:00:00.000Z'): BloodPressure => ({
  id,
  personId: 'p1',
  dateISO,
  systolic: 120,
  diastolic: 80,
});

const PERSON_ID = 'p1';

function Probe({ personId }: { personId: string }) {
  const { items, loading, create, update, remove } = useBloodPressure(personId);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i: BloodPressure) => i.id).join(',')}</Text>
      <Text testID="create" onPress={() => create(mk('new'))} />
      <Text testID="update" onPress={() => update('1', { systolic: 135 })} />
      <Text testID="remove" onPress={() => remove('1')} />
    </>
  );
}

describe('useBloodPressure', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRemove.mockReset();
  });

  it('carrega itens ao montar e os expõe ordenados por data desc', async () => {
    mockList.mockResolvedValueOnce([
      mk('b', '2025-01-02T00:00:00.000Z'),
      mk('a', '2025-01-01T00:00:00.000Z'),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);

    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('ids').props.children).toBe('b,a');
    expect(mockList).toHaveBeenCalledWith(PERSON_ID);
  });

  it('create() adiciona item à lista', async () => {
    mockList.mockResolvedValueOnce([mk('1')]);
    const newItem = mk('new', '2025-06-01T00:00:00.000Z');
    mockCreate.mockResolvedValueOnce(newItem);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => {
      getByTestId('create').props.onPress();
    });

    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
  });

  it('update() substitui item na lista', async () => {
    const original = mk('1');
    mockList.mockResolvedValueOnce([original]);
    const updated = { ...original, systolic: 135 };
    mockUpdate.mockResolvedValueOnce(updated);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => {
      getByTestId('update').props.onPress();
    });

    expect(mockUpdate).toHaveBeenCalledWith(PERSON_ID, '1', { systolic: 135 });
  });

  it('remove() retira item da lista', async () => {
    mockList.mockResolvedValueOnce([mk('1'), mk('2')]);
    mockRemove.mockResolvedValueOnce(true);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));

    await act(async () => {
      getByTestId('remove').props.onPress();
    });

    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(mockRemove).toHaveBeenCalledWith(PERSON_ID, '1');
  });

  it('expõe loading=true durante a busca e false após', async () => {
    let resolve: (v: BloodPressure[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise(res => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() =>
      expect(getByTestId('loading').props.children).toBe('false'),
    );
  });
});
