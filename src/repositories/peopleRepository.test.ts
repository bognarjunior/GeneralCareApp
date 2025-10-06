import type { Person } from '@/types/models/Person';

const mockGetJSON = jest.fn<Promise<Person[] | null>, any>();
const mockSetJSON = jest.fn<Promise<void>, any>();

jest.mock('@/storage/async', () => ({
  getJSON: (...args: any[]) => (global as any).__mockGetJSON(...args),
  setJSON: (...args: any[]) => (global as any).__mockSetJSON(...args),
}));

jest.mock('@/storage/keys', () => ({
  KEY_PEOPLE: '@test/people',
}));

beforeAll(() => {
  (global as any).__mockGetJSON = mockGetJSON;
  (global as any).__mockSetJSON = mockSetJSON;
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  mockGetJSON.mockReset();
  mockSetJSON.mockReset();
});

const mk = (id: string, createdAt: string, extra?: Partial<Person>): Person => ({
  id,
  fullName: `Pessoa ${id}`,
  createdAt,
  updatedAt: createdAt,
  ...extra,
});

describe('peopleRepository', () => {
  const repo = () => require('./peopleRepository') as typeof import('./peopleRepository');

  it('list() ordena por createdAt asc', async () => {
    mockGetJSON.mockResolvedValueOnce([
      mk('b', '2024-02-01T00:00:00.000Z'),
      mk('a', '2023-12-01T00:00:00.000Z'),
    ]);
    const list = await repo().list();
    expect(list.map(p => p.id)).toEqual(['a', 'b']);
    expect(mockGetJSON).toHaveBeenCalledWith('@test/people');
  });

  it('getById() retorna item ou null', async () => {
    mockGetJSON.mockResolvedValueOnce([
      mk('1', '2024-01-01T00:00:00.000Z'),
      mk('2', '2024-01-02T00:00:00.000Z'),
    ]);
    await expect(repo().getById('2')).resolves.toMatchObject({ id: '2' });
    mockGetJSON.mockResolvedValueOnce([
      mk('1', '2024-01-01T00:00:00.000Z'),
      mk('2', '2024-01-02T00:00:00.000Z'),
    ]);
    await expect(repo().getById('x')).resolves.toBeNull();
  });

  it('create() usa crypto.randomUUID quando disponível e persiste com timestamps', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-03-10T12:00:00.000Z'));
    mockGetJSON.mockResolvedValueOnce([mk('1', '2025-03-09T12:00:00.000Z')]);
    (global as any).crypto = { randomUUID: jest.fn().mockReturnValue('uuid-123') };

    const created = await repo().create({
      fullName: 'Nova Pessoa',
      avatarUri: 'x',
    });

    expect(created.id).toBe('uuid-123');
    expect(created.createdAt).toBe('2025-03-10T12:00:00.000Z');
    expect(created.updatedAt).toBe('2025-03-10T12:00:00.000Z');
    expect(mockSetJSON).toHaveBeenCalledTimes(1);
    const payload = mockSetJSON.mock.calls[0][1] as Person[];
    expect(payload.map(p => p.id)).toEqual(['1', 'uuid-123']);
  });

  it('create() usa fallback de id quando randomUUID não existe', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-03-11T08:30:00.000Z'));
    (global as any).crypto = {};
    const spyNow = jest.spyOn(Date, 'now').mockReturnValue(1111);
    const spyRand = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    mockGetJSON.mockResolvedValueOnce([]);

    const created = await repo().create({ fullName: 'Fallback' });

    expect(created.id).toBe('1111-8');
    expect(created.createdAt).toBe('2025-03-11T08:30:00.000Z');
    expect(mockSetJSON).toHaveBeenCalledTimes(1);

    spyNow.mockRestore();
    spyRand.mockRestore();
  });

  it('update() retorna entidade atualizada ou null quando id não existe', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-03-12T10:00:00.000Z'));

    mockGetJSON
      .mockResolvedValueOnce([mk('1', '2025-03-10T00:00:00.000Z', { fullName: 'A' })])
      .mockResolvedValueOnce([mk('1', '2025-03-10T00:00:00.000Z', { fullName: 'A' })]);

    const ok = await repo().update('1', { fullName: 'A+' });
    expect(ok).toMatchObject({ id: '1', fullName: 'A+' });
    const written = (mockSetJSON.mock.calls.at(-1)?.[1] as Person[])[0];
    expect(written.fullName).toBe('A+');
    expect(new Date(written.updatedAt).toISOString()).toBe('2025-03-12T10:00:00.000Z');

    const miss = await repo().update('x', { fullName: 'X' });
    expect(miss).toBeNull();
  });

  it('upsert() insere quando não existe e atualiza quando existe (preserva createdAt no update)', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-03-13T09:00:00.000Z'));

    mockGetJSON.mockResolvedValueOnce([]);
    const inserted = await repo().upsert(
      mk('p1', undefined as any, { createdAt: undefined, updatedAt: undefined })
    );
    expect(inserted.id).toBe('p1');
    expect(inserted.createdAt).toBeTruthy();
    expect(inserted.updatedAt).toBe('2025-03-13T09:00:00.000Z');

    mockGetJSON.mockResolvedValueOnce([
      { ...inserted, fullName: 'Nome Antigo' },
    ]);
    const updated = await repo().upsert({
      ...inserted,
      fullName: 'Nome Novo',
    });
    expect(updated.fullName).toBe('Nome Novo');
    expect(updated.createdAt).toBe(inserted.createdAt);
    expect(updated.updatedAt).toBe('2025-03-13T09:00:00.000Z');
  });

  it('remove() apaga quando encontrou e retorna true; quando não muda, retorna false', async () => {
    mockGetJSON
      .mockResolvedValueOnce([mk('1', '2025-03-10T00:00:00.000Z')])
      .mockResolvedValueOnce([mk('1', '2025-03-10T00:00:00.000Z')]);

    const ok = await repo().remove('1');
    expect(ok).toBe(true);
    expect(mockSetJSON).toHaveBeenCalledTimes(1);
    const payload = mockSetJSON.mock.calls[0][1] as Person[];
    expect(payload).toEqual([]);

    const no = await repo().remove('x');
    expect(no).toBe(false);
    expect(mockSetJSON).toHaveBeenCalledTimes(1);
  });

  it('clearAll() escreve lista vazia', async () => {
    await repo().clearAll();
    expect(mockSetJSON).toHaveBeenCalledWith('@test/people', []);
  });
});
