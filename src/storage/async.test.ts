import { getJSON, setJSON, removeKey } from './async';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
        return Promise.resolve();
      }),
      _store: store,
    },
  };
});

import AsyncStorage from '@react-native-async-storage/async-storage';

describe('storage/async', () => {
  const AS = AsyncStorage as unknown as {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
    _store: Record<string, string>;
  };

  beforeEach(() => {
    AS.clear();
    AS.getItem.mockClear();
    AS.setItem.mockClear();
    AS.removeItem.mockClear();
  });

  it('getJSON retorna null quando a chave não existe', async () => {
    const result = await getJSON<{ a: number }>('missing:key');
    expect(result).toBeNull();
    expect(AS.getItem).toHaveBeenCalledWith('missing:key');
  });

  it('getJSON retorna o objeto parseado quando o valor é JSON válido', async () => {
    AS._store['valid:key'] = JSON.stringify({ a: 1, b: 'ok' });

    const result = await getJSON<{ a: number; b: string }>('valid:key');
    expect(result).toEqual({ a: 1, b: 'ok' });
    expect(AS.getItem).toHaveBeenCalledWith('valid:key');
  });

  it('getJSON retorna null quando o valor é JSON inválido (catch)', async () => {
    AS._store['bad:key'] = '{not-json';

    const result = await getJSON<Record<string, unknown>>('bad:key');
    expect(result).toBeNull();
    expect(AS.getItem).toHaveBeenCalledWith('bad:key');
  });

  it('setJSON serializa o valor e grava com setItem', async () => {
    const payload = { n: 42, s: 'hello' };

    await setJSON('set:key', payload);

    expect(AS.setItem).toHaveBeenCalledTimes(1);
    expect(AS.setItem).toHaveBeenCalledWith('set:key', JSON.stringify(payload));
    expect(AS._store['set:key']).toBe(JSON.stringify(payload));
  });

  it('removeKey remove a chave do armazenamento', async () => {
    AS._store['temp:key'] = JSON.stringify({ x: 1 });

    await removeKey('temp:key');

    expect(AS.removeItem).toHaveBeenCalledWith('temp:key');
    // confirma que sumiu mesmo
    const result = await getJSON('temp:key');
    expect(result).toBeNull();
  });
});
