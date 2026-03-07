import AsyncStorage from '@react-native-async-storage/async-storage';
import { list, create, update, remove, clearAll } from './glycemiaRepository';
import type { Glycemia } from './glycemiaRepository';

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

const PERSON_ID = 'person-1';
const KEY = `glycemia:${PERSON_ID}`;

const mk = (id: string, overrides?: Partial<Glycemia>): Glycemia => ({
  id,
  personId: PERSON_ID,
  dateISO: '2025-01-01T08:00:00.000Z',
  valueMgDl: 95,
  ...overrides,
});

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
  (AsyncStorage.removeItem as jest.Mock).mockReset();
});

// ──────────────────────────────────────────────────────────────────────────
// list
// ──────────────────────────────────────────────────────────────────────────

describe('list()', () => {
  it('retorna array vazio quando não há dados', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    await expect(list(PERSON_ID)).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(KEY);
  });

  it('desserializa e retorna itens salvos', async () => {
    const items = [mk('a'), mk('b')];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(items));
    await expect(list(PERSON_ID)).resolves.toEqual(items);
  });
});

// ──────────────────────────────────────────────────────────────────────────
// create
// ──────────────────────────────────────────────────────────────────────────

describe('create()', () => {
  it('cria registro com id gerado e salva à frente dos existentes', async () => {
    const existing = mk('existing');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([existing]));

    const { nanoid } = require('nanoid/non-secure');
    (nanoid as jest.Mock).mockReturnValueOnce('new-id');

    const created = await create({
      personId: PERSON_ID,
      dateISO: '2025-03-01T10:00:00.000Z',
      valueMgDl: 110,
      context: 'postprandial',
    });

    expect(created.id).toBe('new-id');
    expect(created.valueMgDl).toBe(110);

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].id).toBe('new-id');
    expect(saved[1].id).toBe('existing');
  });

  it('lança erro para valor negativo', async () => {
    await expect(
      create({ personId: PERSON_ID, dateISO: '2025-01-01T00:00:00.000Z', valueMgDl: -1 }),
    ).rejects.toThrow();
  });

  it('lança erro para valor acima de 2000', async () => {
    await expect(
      create({ personId: PERSON_ID, dateISO: '2025-01-01T00:00:00.000Z', valueMgDl: 2001 }),
    ).rejects.toThrow();
  });

  it('lança erro para valor não finito', async () => {
    await expect(
      create({ personId: PERSON_ID, dateISO: '2025-01-01T00:00:00.000Z', valueMgDl: Infinity }),
    ).rejects.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────────────────
// update
// ──────────────────────────────────────────────────────────────────────────

describe('update()', () => {
  it('retorna null quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));
    await expect(update(PERSON_ID, 'x', { valueMgDl: 100 })).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('atualiza campos e persiste', async () => {
    const original = mk('1', { valueMgDl: 95 });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', { valueMgDl: 120, context: 'fasting' });

    expect(result).toMatchObject({ id: '1', valueMgDl: 120, context: 'fasting' });
    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].valueMgDl).toBe(120);
  });

  it('valida o valor ao atualizar', async () => {
    const original = mk('1');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));
    await expect(update(PERSON_ID, '1', { valueMgDl: 9999 })).rejects.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────────────────
// remove
// ──────────────────────────────────────────────────────────────────────────

describe('remove()', () => {
  it('retorna true e persiste lista sem o item removido', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([mk('1'), mk('2')]),
    );

    await expect(remove(PERSON_ID, '1')).resolves.toBe(true);

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved.map((i: { id: string }) => i.id)).toEqual(['2']);
  });

  it('retorna false e não salva quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));

    await expect(remove(PERSON_ID, 'x')).resolves.toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});

// ──────────────────────────────────────────────────────────────────────────
// clearAll
// ──────────────────────────────────────────────────────────────────────────

describe('clearAll()', () => {
  it('chama removeItem com a chave correta', async () => {
    await clearAll(PERSON_ID);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(KEY);
  });
});
