import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import { useFilteredPaginatedData } from './useFilteredPaginatedData';
import type { Filter } from './useFilteredPaginatedData';

type Item = { id: string; dateISO: string; value: number };

const mockList = jest.fn<Promise<Item[]>, [string]>();
const mockCreate = jest.fn<Promise<Item>, [Omit<Item, 'id'>]>();
const mockUpdate = jest.fn<Promise<Item | null>, [string, string, Partial<Item>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

const repo = {
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<Item, 'id'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<Item>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
};

const PERSON_ID = 'p1';

const mk = (id: string, dateISO: string, value = 0): Item => ({ id, dateISO, value });

// Dates relative to "now" that we can control predictably
const TODAY_ISO = new Date().toISOString();
const OLD_ISO = '2000-01-01T00:00:00.000Z';

function Probe({ personId, filter, pageSize }: { personId: string; filter?: Filter; pageSize?: number }) {
  const {
    items,
    loading,
    create,
    update,
    remove,
    filter: currentFilter,
    setFilter,
    loadMore,
    hasMore,
  } = useFilteredPaginatedData<Item, Omit<Item, 'id'>, Partial<Item>>(personId, repo, {
    pageSize: pageSize ?? 20,
    initialFilter: filter ?? 'all',
  });

  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i) => i.id).join(',')}</Text>
      <Text testID="filter">{currentFilter}</Text>
      <Text testID="hasMore">{String(hasMore)}</Text>
      <Text testID="create" onPress={() => create(mk('new', TODAY_ISO, 99))} />
      <Text testID="update" onPress={() => update('1', { value: 999 })} />
      <Text testID="remove" onPress={() => remove('1')} />
      <Text testID="setFilterToday" onPress={() => setFilter('today')} />
      <Text testID="loadMore" onPress={() => loadMore()} />
    </>
  );
}

describe('useFilteredPaginatedData', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRemove.mockReset();
  });

  it('carrega itens ao montar, ordenados desc por data', async () => {
    mockList.mockResolvedValueOnce([
      mk('a', '2025-01-01T00:00:00.000Z'),
      mk('b', '2025-06-01T00:00:00.000Z'),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('ids').props.children).toBe('b,a');
  });

  it('expõe loading=true durante fetch e false após', async () => {
    let resolve: (v: Item[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise((res) => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });

  it('create() adiciona item à lista e mantém ordem desc', async () => {
    mockList.mockResolvedValueOnce([mk('1', '2025-01-01T00:00:00.000Z')]);
    const newItem = mk('new', '2025-12-01T00:00:00.000Z', 99);
    mockCreate.mockResolvedValueOnce(newItem);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('create').props.onPress(); });
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    // newItem has later date → appears first
    expect(getByTestId('ids').props.children).toBe('new,1');
  });

  it('update() substitui item na lista', async () => {
    const original = mk('1', TODAY_ISO, 10);
    mockList.mockResolvedValueOnce([original]);
    const updated = { ...original, value: 999 };
    mockUpdate.mockResolvedValueOnce(updated);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('update').props.onPress(); });
    expect(mockUpdate).toHaveBeenCalledWith(PERSON_ID, '1', { value: 999 });
  });

  it('remove() retira item da lista', async () => {
    mockList.mockResolvedValueOnce([mk('1', TODAY_ISO), mk('2', OLD_ISO)]);
    mockRemove.mockResolvedValueOnce(true);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));

    await act(async () => { getByTestId('remove').props.onPress(); });
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(mockRemove).toHaveBeenCalledWith(PERSON_ID, '1');
  });

  it('filtro "today" exclui itens antigos', async () => {
    mockList.mockResolvedValueOnce([
      mk('today', TODAY_ISO),
      mk('old', OLD_ISO),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));

    await act(async () => { getByTestId('setFilterToday').props.onPress(); });
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(getByTestId('ids').props.children).toBe('today');
  });

  it('hasMore é false quando items <= pageSize', async () => {
    mockList.mockResolvedValueOnce([mk('a', TODAY_ISO)]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} pageSize={5} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(getByTestId('hasMore').props.children).toBe('false');
  });
});
