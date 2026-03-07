import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { useGlycemia } from './useGlycemia';
import type { Glycemia } from '@/repositories/glycemiaRepository';

const mockList = jest.fn<Promise<Glycemia[]>, [string]>();
const mockCreate = jest.fn<Promise<Glycemia>, [Omit<Glycemia, 'id'>]>();
const mockUpdate = jest.fn<Promise<Glycemia | null>, [string, string, Partial<Glycemia>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('@/repositories/glycemiaRepository', () => ({
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<Glycemia, 'id'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<Glycemia>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
}));

const mk = (id: string, dateISO = '2025-01-01T08:00:00.000Z'): Glycemia => ({
  id,
  personId: 'p1',
  dateISO,
  valueMgDl: 95,
});

const PERSON_ID = 'p1';

function Probe({ personId }: { personId: string }) {
  const { items, loading, create, update, remove } = useGlycemia(personId);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i) => i.id).join(',')}</Text>
      <Text testID="create" onPress={() => create(mk('new'))} />
      <Text testID="update" onPress={() => update('1', { valueMgDl: 120 })} />
      <Text testID="remove" onPress={() => remove('1')} />
    </>
  );
}

describe('useGlycemia', () => {
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
    expect(mockList).toHaveBeenCalledWith(PERSON_ID);
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

  it('update() atualiza item na lista', async () => {
    const original = mk('1');
    mockList.mockResolvedValueOnce([original]);
    const updated = { ...original, valueMgDl: 120 };
    mockUpdate.mockResolvedValueOnce(updated);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('update').props.onPress(); });
    expect(mockUpdate).toHaveBeenCalledWith(PERSON_ID, '1', { valueMgDl: 120 });
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
    let resolve: (v: Glycemia[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise((res) => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });
});
