import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { useMeasurements } from './useMeasurements';
import type { Measurement } from '@/repositories/measurementsRepository';

const mockList = jest.fn<Promise<Measurement[]>, [string]>();
const mockCreate = jest.fn<Promise<Measurement>, [Omit<Measurement, 'id' | 'bmi'>]>();
const mockUpdate = jest.fn<Promise<Measurement | null>, [string, string, Partial<Measurement>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('@/repositories/measurementsRepository', () => ({
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<Measurement, 'id' | 'bmi'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<Measurement>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
  calcBMI: (w: number, h: number) => Number(((w / ((h / 100) ** 2)).toFixed(2))),
}));

const mk = (id: string, dateISO = '2025-01-01T08:00:00.000Z'): Measurement => ({
  id,
  personId: 'p1',
  dateISO,
  weightKg: 70,
  heightCm: 170,
  bmi: 24.22,
});

const PERSON_ID = 'p1';

function Probe({ personId }: { personId: string }) {
  const { items, loading, calcBMI, create, update, remove } = useMeasurements(personId);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i) => i.id).join(',')}</Text>
      <Text testID="bmi">{String(calcBMI(70, 170))}</Text>
      <Text testID="create" onPress={() => create({ personId: PERSON_ID, dateISO: '2025-06-01T00:00:00.000Z', weightKg: 72, heightCm: 170 })} />
      <Text testID="update" onPress={() => update('1', { weightKg: 75 })} />
      <Text testID="remove" onPress={() => remove('1')} />
    </>
  );
}

describe('useMeasurements', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRemove.mockReset();
  });

  it('carrega itens ao montar ordenados por data desc', async () => {
    mockList.mockResolvedValueOnce([
      mk('b', '2025-06-01T00:00:00.000Z'),
      mk('a', '2025-01-01T00:00:00.000Z'),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('ids').props.children).toBe('b,a');
  });

  it('expõe calcBMI como extra', async () => {
    mockList.mockResolvedValueOnce([]);
    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    // 70 / (1.70^2) ≈ 24.22
    expect(Number(getByTestId('bmi').props.children)).toBeCloseTo(24.22, 1);
  });

  it('create() adiciona item à lista', async () => {
    mockList.mockResolvedValueOnce([mk('1')]);
    const newItem = mk('new', '2025-12-01T00:00:00.000Z');
    mockCreate.mockResolvedValueOnce(newItem);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('create').props.onPress(); });
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
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

  it('expõe loading=true durante a busca e false após', async () => {
    let resolve: (v: Measurement[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise((res) => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });
});
