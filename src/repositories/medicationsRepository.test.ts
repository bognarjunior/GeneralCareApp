import AsyncStorage from '@react-native-async-storage/async-storage';
import { list, create, update, remove, clearAll } from './medicationsRepository';
import type { Medication } from './medicationsRepository';

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

const PERSON_ID = 'person-1';
const KEY = `medications:${PERSON_ID}`;

const mk = (id: string, overrides?: Partial<Medication>): Medication => ({
  id,
  personId: PERSON_ID,
  createdAt: '2025-01-01T08:00:00.000Z',
  updatedAt: '2025-01-01T08:00:00.000Z',
  name: 'Losartana',
  scheduleTimes: [],
  isActive: true,
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
    const result = await list(PERSON_ID);
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('ordena: ativos antes de inativos', async () => {
    const items = [
      mk('inactive', { isActive: false, createdAt: '2025-02-01T00:00:00.000Z' }),
      mk('active', { isActive: true, createdAt: '2025-01-01T00:00:00.000Z' }),
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(items));
    const result = await list(PERSON_ID);
    expect(result[0].id).toBe('active');
    expect(result[1].id).toBe('inactive');
  });

  it('ordena ativos por createdAt desc', async () => {
    const items = [
      mk('old', { createdAt: '2025-01-01T00:00:00.000Z' }),
      mk('new', { createdAt: '2025-06-01T00:00:00.000Z' }),
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(items));
    const result = await list(PERSON_ID);
    expect(result[0].id).toBe('new');
    expect(result[1].id).toBe('old');
  });
});

// ──────────────────────────────────────────────────────────────────────────
// create
// ──────────────────────────────────────────────────────────────────────────

describe('create()', () => {
  it('cria com id gerado, createdAt e updatedAt e salva à frente dos existentes', async () => {
    const existing = mk('existing');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([existing]));

    const { nanoid } = require('nanoid/non-secure');
    (nanoid as jest.Mock).mockReturnValueOnce('new-id');

    const created = await create({
      personId: PERSON_ID,
      name: 'Atenolol',
      scheduleTimes: ['08:00'],
      isActive: true,
    });

    expect(created.id).toBe('new-id');
    expect(created.name).toBe('Atenolol');
    expect(created.createdAt).toBeTruthy();
    expect(created.updatedAt).toBeTruthy();

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].id).toBe('new-id');
    expect(saved[1].id).toBe('existing');
  });

  it('persiste campos opcionais quando fornecidos', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const created = await create({
      personId: PERSON_ID,
      name: 'Metformina',
      dosage: '500mg',
      scheduleTimes: ['07:00', '19:00'],
      startDate: '01/01/2025',
      endDate: '31/12/2025',
      notes: 'Com refeição',
      isActive: true,
    });

    expect(created.dosage).toBe('500mg');
    expect(created.scheduleTimes).toEqual(['07:00', '19:00']);
    expect(created.notes).toBe('Com refeição');
  });
});

// ──────────────────────────────────────────────────────────────────────────
// update
// ──────────────────────────────────────────────────────────────────────────

describe('update()', () => {
  it('retorna null quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));
    await expect(update(PERSON_ID, 'x', { name: 'X' })).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('atualiza campos e persiste, atualizando updatedAt', async () => {
    const original = mk('1', { name: 'Losartana', isActive: true });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', { name: 'Losartana 50mg', isActive: false });

    expect(result).toMatchObject({ id: '1', name: 'Losartana 50mg', isActive: false });
    expect(result!.updatedAt).not.toBe(original.updatedAt);

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].name).toBe('Losartana 50mg');
  });

  it('mantém createdAt original ao atualizar', async () => {
    const original = mk('1', { createdAt: '2025-01-01T00:00:00.000Z' });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', { name: 'Novo' });
    expect(result!.createdAt).toBe('2025-01-01T00:00:00.000Z');
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
