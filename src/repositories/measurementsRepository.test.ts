import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calcBMI,
  list,
  listMonths,
  listByMonth,
  create,
  update,
  remove,
  clearAll,
} from './measurementsRepository';
import type { Measurement } from './measurementsRepository';

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

const PERSON_ID = 'person-1';
const INDEX_KEY = `measurements:index:${PERSON_ID}`;
const monthKey = (m: string) => `measurements:${PERSON_ID}:${m}`;

const mk = (id: string, overrides?: Partial<Measurement>): Measurement => ({
  id,
  personId: PERSON_ID,
  dateISO: '2025-01-15T08:00:00.000Z',
  weightKg: 70,
  heightCm: 170,
  bmi: 24.22,
  ...overrides,
});

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
  (AsyncStorage.removeItem as jest.Mock).mockReset();
});

// ──────────────────────────────────────────────────────────────────────────
// calcBMI
// ──────────────────────────────────────────────────────────────────────────

describe('calcBMI()', () => {
  it('calcula IMC corretamente', () => {
    expect(calcBMI(70, 170)).toBe(24.22);
  });

  it('evita divisão por zero com altura mínima', () => {
    expect(() => calcBMI(70, 0)).not.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────────────────
// listMonths / listByMonth
// ──────────────────────────────────────────────────────────────────────────

describe('listMonths()', () => {
  it('retorna array vazio quando não há índice', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    await expect(listMonths(PERSON_ID)).resolves.toEqual([]);
  });

  it('retorna meses do índice ordenados desc', async () => {
    const months = ['2025-03', '2025-01', '2025-02'];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(months));
    await expect(listMonths(PERSON_ID)).resolves.toEqual(['2025-03', '2025-02', '2025-01']);
  });
});

describe('listByMonth()', () => {
  it('retorna itens do mês ordenados desc por data', async () => {
    const items = [
      mk('a', { dateISO: '2025-01-10T00:00:00.000Z' }),
      mk('b', { dateISO: '2025-01-20T00:00:00.000Z' }),
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(items));
    const result = await listByMonth(PERSON_ID, '2025-01');
    expect(result[0].id).toBe('b');
    expect(result[1].id).toBe('a');
  });
});

// ──────────────────────────────────────────────────────────────────────────
// list
// ──────────────────────────────────────────────────────────────────────────

describe('list()', () => {
  it('retorna array vazio quando índice vazio', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    await expect(list(PERSON_ID)).resolves.toEqual([]);
  });

  it('agrega itens de múltiplos meses ordenados desc', async () => {
    const jan = mk('jan', { dateISO: '2025-01-15T00:00:00.000Z' });
    const feb = mk('feb', { dateISO: '2025-02-15T00:00:00.000Z' });

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(['2025-02', '2025-01'])) // index
      .mockResolvedValueOnce(JSON.stringify([feb]))                  // 2025-02
      .mockResolvedValueOnce(JSON.stringify([jan]));                 // 2025-01

    const result = await list(PERSON_ID);
    expect(result.map((m) => m.id)).toEqual(['feb', 'jan']);
  });
});

// ──────────────────────────────────────────────────────────────────────────
// create
// ──────────────────────────────────────────────────────────────────────────

describe('create()', () => {
  it('cria medição com id gerado e BMI calculado', async () => {
    const { nanoid } = require('nanoid/non-secure');
    (nanoid as jest.Mock).mockReturnValueOnce('new-id');

    // loadMonth for 2025-01 → empty
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)  // loadMonth
      .mockResolvedValueOnce(null); // loadIndex

    const created = await create({
      personId: PERSON_ID,
      dateISO: '2025-01-15T08:00:00.000Z',
      weightKg: 70,
      heightCm: 170,
    });

    expect(created.id).toBe('new-id');
    expect(created.bmi).toBe(24.22);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2); // saveMonth + saveIndex
  });

  it('não duplica mês no índice se já existir', async () => {
    const { nanoid } = require('nanoid/non-secure');
    (nanoid as jest.Mock).mockReturnValueOnce('id2');

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify([mk('existing', { dateISO: '2025-01-10T00:00:00.000Z' })]))  // loadMonth
      .mockResolvedValueOnce(JSON.stringify(['2025-01']));  // loadIndex

    await create({
      personId: PERSON_ID,
      dateISO: '2025-01-20T08:00:00.000Z',
      weightKg: 72,
      heightCm: 170,
    });

    // Only saveMonth should be called (index not updated since month already exists)
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

// ──────────────────────────────────────────────────────────────────────────
// update
// ──────────────────────────────────────────────────────────────────────────

describe('update()', () => {
  it('retorna null quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(['2025-01']))         // loadIndex
      .mockResolvedValueOnce(JSON.stringify([mk('other')]));      // loadMonth

    await expect(update(PERSON_ID, 'missing', { weightKg: 75 })).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('atualiza item no mesmo mês e recalcula BMI', async () => {
    const original = mk('1', { weightKg: 70, heightCm: 170 });
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(['2025-01']))       // loadIndex
      .mockResolvedValueOnce(JSON.stringify([original]))        // loadMonth (find)
      .mockResolvedValueOnce(JSON.stringify([original]));       // loadMonth (save)

    const result = await update(PERSON_ID, '1', { weightKg: 80 });

    expect(result).not.toBeNull();
    expect(result!.weightKg).toBe(80);
    expect(result!.bmi).toBe(calcBMI(80, 170));
  });
});

// ──────────────────────────────────────────────────────────────────────────
// remove
// ──────────────────────────────────────────────────────────────────────────

describe('remove()', () => {
  it('retorna false quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(['2025-01']))
      .mockResolvedValueOnce(JSON.stringify([mk('other')]));

    await expect(remove(PERSON_ID, 'missing')).resolves.toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('remove item e atualiza o mês', async () => {
    const item1 = mk('1', { dateISO: '2025-01-10T00:00:00.000Z' });
    const item2 = mk('2', { dateISO: '2025-01-20T00:00:00.000Z' });

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(['2025-01']))
      .mockResolvedValueOnce(JSON.stringify([item2, item1]));

    await expect(remove(PERSON_ID, '1')).resolves.toBe(true);

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved.map((m: Measurement) => m.id)).toEqual(['2']);
  });

  it('remove o mês do índice quando o mês fica vazio', async () => {
    const item = mk('1');

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(['2025-01']))
      .mockResolvedValueOnce(JSON.stringify([item]));

    await remove(PERSON_ID, '1');

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(monthKey('2025-01'));
    const indexSaved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(indexSaved).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────
// clearAll
// ──────────────────────────────────────────────────────────────────────────

describe('clearAll()', () => {
  it('remove todos os meses e o índice', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(['2025-02', '2025-01']),
    );

    await clearAll(PERSON_ID);

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(monthKey('2025-02'));
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(monthKey('2025-01'));
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(INDEX_KEY);
  });
});
