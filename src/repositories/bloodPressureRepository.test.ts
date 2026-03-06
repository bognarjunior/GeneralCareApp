import AsyncStorage from '@react-native-async-storage/async-storage';
import { classify, list, create, update, remove, clearAll } from './bloodPressureRepository';
import type { BloodPressure } from './bloodPressureRepository';

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

const PERSON_ID = 'person-1';
const KEY = `blood_pressure:${PERSON_ID}`;

const mk = (id: string, overrides?: Partial<BloodPressure>): BloodPressure => ({
  id,
  personId: PERSON_ID,
  dateISO: '2025-01-01T08:00:00.000Z',
  systolic: 120,
  diastolic: 80,
  ...overrides,
});

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
  (AsyncStorage.removeItem as jest.Mock).mockReset();
});

// ──────────────────────────────────────────────────────────────────────────
// classify
// ──────────────────────────────────────────────────────────────────────────

describe('classify()', () => {
  it('normal — sistólica < 120 e diastólica < 80', () => {
    expect(classify(110, 70)).toBe('normal');
    expect(classify(119, 79)).toBe('normal');
  });

  it('elevated — sistólica 120-129 e diastólica < 80', () => {
    expect(classify(120, 75)).toBe('elevated');
    expect(classify(129, 79)).toBe('elevated');
  });

  it('hypertension_1 — sistólica 130-139 OU diastólica 80-89', () => {
    expect(classify(130, 75)).toBe('hypertension_1');
    expect(classify(125, 80)).toBe('hypertension_1');
    expect(classify(139, 89)).toBe('hypertension_1');
  });

  it('hypertension_2 — sistólica >= 140 OU diastólica >= 90', () => {
    expect(classify(140, 85)).toBe('hypertension_2');
    expect(classify(130, 90)).toBe('hypertension_2');
    expect(classify(180, 110)).toBe('hypertension_2');
  });
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
      systolic: 125,
      diastolic: 82,
      pulse: 70,
    });

    expect(created.id).toBe('new-id');
    expect(created.systolic).toBe(125);

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].id).toBe('new-id');
    expect(saved[1].id).toBe('existing');
  });

  it('lança erro para sistólica inválida', async () => {
    await expect(
      create({ personId: PERSON_ID, dateISO: '2025-01-01T00:00:00.000Z', systolic: -1, diastolic: 80 }),
    ).rejects.toThrow('sistólico');
  });

  it('lança erro para diastólica inválida', async () => {
    await expect(
      create({ personId: PERSON_ID, dateISO: '2025-01-01T00:00:00.000Z', systolic: 120, diastolic: 999 }),
    ).rejects.toThrow('diastólico');
  });
});

// ──────────────────────────────────────────────────────────────────────────
// update
// ──────────────────────────────────────────────────────────────────────────

describe('update()', () => {
  it('retorna null quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));
    await expect(update(PERSON_ID, 'x', { systolic: 130 })).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('atualiza campos e persiste', async () => {
    const original = mk('1', { systolic: 120, diastolic: 80 });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', { systolic: 135, notes: 'Pós-exercício' });

    expect(result).toMatchObject({ id: '1', systolic: 135, notes: 'Pós-exercício' });

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].systolic).toBe(135);
  });

  it('valida valores ao atualizar sistólica', async () => {
    const original = mk('1');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));
    await expect(update(PERSON_ID, '1', { systolic: 400 })).rejects.toThrow('sistólico');
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
