import React from 'react';
import { Text } from 'react-native';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { useMedications } from './useMedications';
import type { Medication } from '@/repositories/medicationsRepository';

const mockList = jest.fn<Promise<Medication[]>, [string]>();
const mockCreate = jest.fn<Promise<Medication>, [Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>]>();
const mockUpdate = jest.fn<Promise<Medication | null>, [string, string, Partial<Medication>]>();
const mockRemove = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('@/repositories/medicationsRepository', () => ({
  list: (...args: [string]) => mockList(...args),
  create: (...args: [Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>]) => mockCreate(...args),
  update: (...args: [string, string, Partial<Medication>]) => mockUpdate(...args),
  remove: (...args: [string, string]) => mockRemove(...args),
}));

const mk = (id: string, overrides?: Partial<Medication>): Medication => ({
  id,
  personId: 'p1',
  name: 'Losartana',
  scheduleTimes: [],
  isActive: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

const PERSON_ID = 'p1';

function Probe({ personId }: { personId: string }) {
  const { items, loading, create, update, remove, toggle } = useMedications(personId);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="count">{items.length}</Text>
      <Text testID="ids">{items.map((i: Medication) => i.id).join(',')}</Text>
      <Text testID="active">{items.map((i: Medication) => String(i.isActive)).join(',')}</Text>
      <Text testID="create" onPress={() => create({ personId, name: 'Novo', scheduleTimes: [], isActive: true })} />
      <Text testID="update" onPress={() => update('1', { name: 'Editado' })} />
      <Text testID="remove" onPress={() => remove('1')} />
      <Text testID="toggle" onPress={() => toggle('1')} />
    </>
  );
}

describe('useMedications', () => {
  beforeEach(() => {
    mockList.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRemove.mockReset();
  });

  it('carrega itens ao montar na ordem retornada pelo repositório', async () => {
    // A ordenação (ativos primeiro, desc por createdAt) é responsabilidade do repositório.
    // O hook preserva a ordem recebida.
    mockList.mockResolvedValueOnce([
      mk('active-new', { isActive: true, createdAt: '2025-05-01T00:00:00.000Z' }),
      mk('active-old', { isActive: true, createdAt: '2025-01-01T00:00:00.000Z' }),
      mk('inactive', { isActive: false, createdAt: '2025-06-01T00:00:00.000Z' }),
    ]);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);

    await waitFor(() => expect(getByTestId('count').props.children).toBe(3));
    expect(getByTestId('ids').props.children).toBe('active-new,active-old,inactive');
    expect(mockList).toHaveBeenCalledWith(PERSON_ID);
  });

  it('expõe loading=true durante a busca e false após', async () => {
    let resolve: (v: Medication[]) => void = () => {};
    mockList.mockReturnValueOnce(new Promise(res => { resolve = res; }));

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    expect(getByTestId('loading').props.children).toBe('true');

    await act(async () => { resolve([]); });
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
  });

  it('create() adiciona item à lista e reordena', async () => {
    mockList.mockResolvedValueOnce([mk('1')]);
    const newItem = mk('new', { createdAt: '2025-12-01T00:00:00.000Z' });
    mockCreate.mockResolvedValueOnce(newItem);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('create').props.onPress(); });

    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(getByTestId('ids').props.children).toContain('new');
  });

  it('update() substitui item na lista', async () => {
    mockList.mockResolvedValueOnce([mk('1', { name: 'Original' })]);
    const updated = mk('1', { name: 'Editado' });
    mockUpdate.mockResolvedValueOnce(updated);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('update').props.onPress(); });

    expect(mockUpdate).toHaveBeenCalledWith(PERSON_ID, '1', { name: 'Editado' });
  });

  it('update() não altera a lista quando retorna null', async () => {
    mockList.mockResolvedValueOnce([mk('1')]);
    mockUpdate.mockResolvedValueOnce(null);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('update').props.onPress(); });

    expect(getByTestId('count').props.children).toBe(1);
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

  it('toggle() inverte isActive do item', async () => {
    mockList.mockResolvedValueOnce([mk('1', { isActive: true })]);
    const toggled = mk('1', { isActive: false });
    mockUpdate.mockResolvedValueOnce(toggled);

    const { getByTestId } = render(<Probe personId={PERSON_ID} />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));

    await act(async () => { getByTestId('toggle').props.onPress(); });

    expect(mockUpdate).toHaveBeenCalledWith(PERSON_ID, '1', { isActive: false });
  });
});
