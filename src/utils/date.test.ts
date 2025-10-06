import { isValidDDMMYYYY, formatDDMMYYYY, parseDDMMYYYY } from './date';

describe('utils/date', () => {
  const FIXED_NOW = new Date('2025-03-15T12:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('isValidDDMMYYYY', () => {
    it('retorna true para vazio/undefined', () => {
      expect(isValidDDMMYYYY()).toBe(true);
      expect(isValidDDMMYYYY('')).toBe(true);
    });

    it('valida formato DD/MM/AAAA', () => {
      expect(isValidDDMMYYYY('1/03/2025')).toBe(false);
      expect(isValidDDMMYYYY('01-03-2025')).toBe(false);
      expect(isValidDDMMYYYY('aa/bb/cccc')).toBe(false);
    });

    it('valida datas reais (inclui bissexto) e recusa impossíveis', () => {
      expect(isValidDDMMYYYY('29/02/2024')).toBe(true);
      expect(isValidDDMMYYYY('29/02/2023')).toBe(false);
      expect(isValidDDMMYYYY('31/04/2024')).toBe(false);
    });

    it('recusa datas futuras em relação ao "hoje" fixado', () => {
      expect(isValidDDMMYYYY('15/03/2025')).toBe(true);
      expect(isValidDDMMYYYY('16/03/2025')).toBe(false);
    });
  });

  describe('formatDDMMYYYY', () => {
    it('formata com zero à esquerda em dia/mês', () => {
      expect(formatDDMMYYYY(new Date(2025, 2, 5))).toBe('05/03/2025');
      expect(formatDDMMYYYY(new Date(1990, 0, 1))).toBe('01/01/1990');
    });
  });

  describe('parseDDMMYYYY', () => {
    it('retorna Date válida para strings válidas (ignora espaços laterais)', () => {
      const d = parseDDMMYYYY(' 05/03/2025 ');
      expect(d).not.toBeNull();
      expect(d!.getFullYear()).toBe(2025);
      expect(d!.getMonth()).toBe(2);
      expect(d!.getDate()).toBe(5);
    });

    it('retorna null para formato inválido ou data impossível', () => {
      expect(parseDDMMYYYY(undefined)).toBeNull();
      expect(parseDDMMYYYY('05-03-2025')).toBeNull();
      expect(parseDDMMYYYY('31/04/2024')).toBeNull();
      expect(parseDDMMYYYY('29/02/2023')).toBeNull();
    });
  });
});
