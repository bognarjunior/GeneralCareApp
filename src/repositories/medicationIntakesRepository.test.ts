import AsyncStorage from '@react-native-async-storage/async-storage';
import { list, create, update, remove, clearAll } from './medicationIntakesRepository';
import type { MedicationIntake } from './medicationIntakesRepository';

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

const PERSON_ID = 'person-1';
const KEY = `medication_intakes:${PERSON_ID}`;

const mk = (id: string, overrides?: Partial<MedicationIntake>): MedicationIntake => ({
  id,
  personId: PERSON_ID,
  medicationId: 'med-1',
  medicationName: 'Losartana',
  dateISO: '2025-01-01T08:00:00.000Z',
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

  it('retorna itens ordenados por dateISO desc', async () => {
    const items = [
      mk('old', { dateISO: '2025-01-01T00:00:00.000Z' }),
      mk('new', { dateISO: '2025-06-01T00:00:00.000Z' }),
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
  it('cria com id gerado e salva à frente dos existentes', async () => {
    const existing = mk('existing');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([existing]));

    const { nanoid } = require('nanoid/non-secure');
    (nanoid as jest.Mock).mockReturnValueOnce('new-id');

    const created = await create({
      personId: PERSON_ID,
      medicationId: 'med-1',
      medicationName: 'Losartana',
      dateISO: '2025-03-01T10:00:00.000Z',
      scheduledTime: '08:00',
    });

    expect(created.id).toBe('new-id');
    expect(created.scheduledTime).toBe('08:00');

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].id).toBe('new-id');
    expect(saved[1].id).toBe('existing');
  });

  it('persiste campos opcionais quando fornecidos', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const created = await create({
      personId: PERSON_ID,
      medicationId: 'med-2',
      medicationName: 'Atenolol',
      dateISO: '2025-05-10T20:00:00.000Z',
      scheduledTime: '20:00',
      notes: 'Tomou com água',
    });

    expect(created.notes).toBe('Tomou com água');
    expect(created.medicationName).toBe('Atenolol');
  });
});

// ──────────────────────────────────────────────────────────────────────────
// update
// ──────────────────────────────────────────────────────────────────────────

describe('update()', () => {
  it('retorna null quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));
    await expect(update(PERSON_ID, 'x', { notes: 'X' })).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('atualiza campos e persiste', async () => {
    const original = mk('1', { notes: undefined });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', {
      notes: 'Atualizado',
      dateISO: '2025-04-01T09:00:00.000Z',
    });

    expect(result).toMatchObject({ id: '1', notes: 'Atualizado' });

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].notes).toBe('Atualizado');
  });

  it('não altera medicationId ao atualizar', async () => {
    const original = mk('1', { medicationId: 'med-1' });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', { notes: 'Ok' });
    expect(result!.medicationId).toBe('med-1');
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
