/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { Text as RNText } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PeopleProvider, usePeople } from './PeopleContext';
import type { Person } from '@/types/models/Person';

jest.mock('@/repositories/peopleRepository', () => ({
  list:   jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
}));
import * as repo from '@/repositories/peopleRepository';

const mk = (id: string, fullName: string): Person => ({
  id,
  fullName,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

const TestText = (props: any) => <RNText accessibilityRole="text" {...props} />;

const TestConsumer = () => {
  const {
    people,
    loading,
    error,
    refresh,
    createPerson,
    updatePerson,
    removePerson,
    getPerson,
    clearAll,
  } = usePeople();

  return (
    <>
      <TestText testID="len">{people.length}</TestText>
      <TestText testID="loading">{String(loading)}</TestText>
      <TestText testID="error">{error ? 'err' : ''}</TestText>

      <TestText testID="first">{people[0]?.id ?? ''}</TestText>
      <TestText testID="second">{people[1]?.id ?? ''}</TestText>

      <TestText testID="found">{getPerson('1')?.id ?? ''}</TestText>

      <RNText accessibilityLabel="refresh" onPress={() => refresh()} />
      <RNText
        accessibilityLabel="create"
        onPress={() => createPerson({ fullName: 'Novo', notes: 'n' })}
      />
      <RNText
        accessibilityLabel="update-ok"
        onPress={() => updatePerson('1', { fullName: 'Atualizado' })}
      />
      <RNText
        accessibilityLabel="update-null"
        onPress={() => updatePerson('9', { fullName: 'Nada' })}
      />
      <RNText accessibilityLabel="remove" onPress={() => removePerson('2')} />
      <RNText accessibilityLabel="clear" onPress={() => clearAll()} />
    </>
  );
};

async function renderHarness(initial: Person[] = []) {
  (repo.list as jest.Mock).mockResolvedValueOnce(initial);

  const ui = render(
    <PeopleProvider>
      <TestConsumer />
    </PeopleProvider>
  );

  await waitFor(() => expect(ui.getByTestId('loading').props.children).toBe('false'));
  return ui;
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('chama list no mount e popula; refresh funciona; error vazio', async () => {
  const ui = await renderHarness([mk('1', 'João'), mk('2', 'Maria')]);

  expect(repo.list).toHaveBeenCalledTimes(1);
  expect(ui.getByTestId('len').props.children).toBe(2);
  expect(ui.getByTestId('first').props.children).toBe('1');
  expect(ui.getByTestId('found').props.children).toBe('1');

  (repo.list as jest.Mock).mockResolvedValueOnce([mk('10', 'Ana')]);
  fireEvent.press(ui.getByLabelText('refresh'));
  await waitFor(() => expect(ui.getByTestId('len').props.children).toBe(1));
  expect(ui.getByTestId('first').props.children).toBe('10');
});

it('createPerson adiciona ao final', async () => {
  const ui = await renderHarness([]);
  (repo.create as jest.Mock).mockResolvedValueOnce(mk('10', 'Novo'));

  fireEvent.press(ui.getByLabelText('create'));

  await waitFor(() => expect(ui.getByTestId('len').props.children).toBe(1));
  expect(ui.getByTestId('first').props.children).toBe('10');
});

it('updatePerson substitui quando update retorna entidade', async () => {
  const ui = await renderHarness([mk('1', 'A')]);
  (repo.update as jest.Mock).mockResolvedValueOnce(mk('1', 'A+'));

  fireEvent.press(ui.getByLabelText('update-ok'));
  await waitFor(() => expect(ui.getByTestId('first').props.children).toBe('1'));
});

it('updatePerson mantém itens não-matching inalterados (cobre branch do map)', async () => {
  const ui = await renderHarness([mk('1', 'A'), mk('2', 'B')]);
  (repo.update as jest.Mock).mockResolvedValueOnce(mk('1', 'A+'));

  fireEvent.press(ui.getByLabelText('update-ok'));

  await waitFor(() => {
    expect(ui.getByTestId('len').props.children).toBe(2);
    expect(ui.getByTestId('first').props.children).toBe('1');
    expect(ui.getByTestId('second').props.children).toBe('2');
  });
});

it('updatePerson não altera quando repo.update retorna null', async () => {
  const ui = await renderHarness([mk('1', 'A')]);
  (repo.update as jest.Mock).mockResolvedValueOnce(null);

  fireEvent.press(ui.getByLabelText('update-null'));
  await waitFor(() => expect(ui.getByTestId('len').props.children).toBe(1));
});

it('removePerson remove quando true; mantém quando false', async () => {
  const ui = await renderHarness([mk('1', 'A'), mk('2', 'B')]);

  (repo.remove as jest.Mock).mockResolvedValueOnce(true);
  fireEvent.press(ui.getByLabelText('remove'));
  await waitFor(() => expect(ui.getByTestId('len').props.children).toBe(1));

  (repo.remove as jest.Mock).mockResolvedValueOnce(false);
  fireEvent.press(ui.getByLabelText('remove'));
  await waitFor(() => expect(ui.getByTestId('len').props.children).toBe(1));
});

it('clearAll limpa lista e chama repo.clearAll', async () => {
  const ui = await renderHarness([mk('1', 'A')]);

  (repo.clearAll as jest.Mock).mockResolvedValueOnce(undefined);
  fireEvent.press(ui.getByLabelText('clear'));

  await waitFor(() => expect(ui.getByTestId('len').props.children).toBe(0));
  expect(repo.clearAll).toHaveBeenCalledTimes(1);
});

it('usePeople fora do provider lança erro esperado', () => {
  const Rogue = () => {
    usePeople();
    return null;
  };

  expect(() => render(<Rogue />)).toThrow(
    'usePeople must be used within a PeopleProvider'
  );
});
it('refresh coloca error quando list rejeita (cobre setError(err))', async () => {
  const repo = require('@/repositories/peopleRepository') as jest.Mocked<
    typeof import('@/repositories/peopleRepository')
  >;
  repo.list.mockRejectedValueOnce(new Error('err'));

  const ui = await renderHarness();

  await waitFor(() =>
    expect(ui.getByTestId('error').props.children).toBe('err')
  );
});
