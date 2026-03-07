import AsyncStorage from '@react-native-async-storage/async-storage';
import { list, create, update, remove, clearAll } from './appointmentsRepository';
import type { Appointment } from './appointmentsRepository';

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

const PERSON_ID = 'person-1';
const KEY = `appointments:${PERSON_ID}`;

const mk = (id: string, overrides?: Partial<Appointment>): Appointment => ({
  id,
  personId: PERSON_ID,
  dateISO: '2025-06-01T10:00:00.000Z',
  ...overrides,
});

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
  (AsyncStorage.removeItem as jest.Mock).mockReset();
});

describe('list()', () => {
  it('retorna array vazio quando não há dados', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    await expect(list(PERSON_ID)).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(KEY);
  });

  it('retorna itens ordenados por dateISO desc', async () => {
    const items = [
      mk('old', { dateISO: '2025-01-01T00:00:00.000Z' }),
      mk('new', { dateISO: '2025-12-01T00:00:00.000Z' }),
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(items));
    const result = await list(PERSON_ID);
    expect(result[0].id).toBe('new');
    expect(result[1].id).toBe('old');
  });
});

describe('create()', () => {
  it('cria com id gerado e salva à frente dos existentes', async () => {
    const existing = mk('existing');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([existing]));

    const { nanoid } = require('nanoid/non-secure');
    (nanoid as jest.Mock).mockReturnValueOnce('new-id');

    const created = await create({
      personId: PERSON_ID,
      dateISO: '2025-09-15T14:30:00.000Z',
      doctor: 'Dr. João',
      specialty: 'Cardiologia',
    });

    expect(created.id).toBe('new-id');
    expect(created.doctor).toBe('Dr. João');
    expect(created.specialty).toBe('Cardiologia');

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].id).toBe('new-id');
    expect(saved[1].id).toBe('existing');
  });

  it('persiste campos opcionais quando fornecidos', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const created = await create({
      personId: PERSON_ID,
      dateISO: '2025-09-15T14:30:00.000Z',
      location: 'Hospital Central',
      notes: 'Levar exames',
    });

    expect(created.location).toBe('Hospital Central');
    expect(created.notes).toBe('Levar exames');
  });
});

describe('update()', () => {
  it('retorna null quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));
    await expect(update(PERSON_ID, 'x', { doctor: 'X' })).resolves.toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('atualiza campos e persiste', async () => {
    const original = mk('1', { doctor: 'Dr. Original' });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([original]));

    const result = await update(PERSON_ID, '1', { doctor: 'Dr. Novo', notes: 'Retorno' });

    expect(result).toMatchObject({ id: '1', doctor: 'Dr. Novo', notes: 'Retorno' });

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved[0].doctor).toBe('Dr. Novo');
  });
});

describe('remove()', () => {
  it('retorna true e persiste lista sem o item removido', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([mk('1'), mk('2')]),
    );

    await expect(remove(PERSON_ID, '1')).resolves.toBe(true);

    const saved = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
    expect(saved.map((i: { id: string }) => i.id)).toEqual(['2']);
  });

  it('retorna false quando id não existe', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([mk('1')]));
    await expect(remove(PERSON_ID, 'x')).resolves.toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});

describe('clearAll()', () => {
  it('chama removeItem com a chave correta', async () => {
    await clearAll(PERSON_ID);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(KEY);
  });
});
