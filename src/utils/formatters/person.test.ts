import { getInitials, getAgeLabel } from './person';

describe('getInitials()', () => {
  it('retorna a inicial do primeiro e último nome', () => {
    expect(getInitials('João Silva')).toBe('JS');
  });

  it('usa apenas a inicial quando há um único nome', () => {
    expect(getInitials('Maria')).toBe('M');
  });

  it('usa primeiro e último quando há múltiplas partes', () => {
    expect(getInitials('Ana Clara Souza')).toBe('AS');
  });

  it('retorna em maiúsculas', () => {
    expect(getInitials('pedro neto')).toBe('PN');
  });

  it('ignora espaços extras', () => {
    expect(getInitials('  João   Silva  ')).toBe('JS');
  });

  it('retorna string vazia para nome vazio', () => {
    expect(getInitials('')).toBe('');
  });
});

describe('getAgeLabel()', () => {
  const FIXED_NOW = new Date('2025-03-15T12:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('retorna undefined para birthDate ausente', () => {
    expect(getAgeLabel(undefined)).toBeUndefined();
    expect(getAgeLabel('')).toBeUndefined();
  });

  it('retorna undefined para formato inválido', () => {
    expect(getAgeLabel('2000-01-01')).toBeUndefined();
    expect(getAgeLabel('abc')).toBeUndefined();
  });

  it('calcula idade corretamente quando aniversário já passou no ano', () => {
    expect(getAgeLabel('10/01/1990')).toBe('35 anos');
  });

  it('calcula idade corretamente quando aniversário ainda não chegou', () => {
    // Aniversário em dezembro, "hoje" é março → ainda não completou
    expect(getAgeLabel('10/12/1990')).toBe('34 anos');
  });

  it('retorna "1 ano" no singular', () => {
    expect(getAgeLabel('10/01/2024')).toBe('1 ano');
  });

  it('retorna undefined para idades impossíveis (> 130 anos)', () => {
    expect(getAgeLabel('01/01/1800')).toBeUndefined();
  });
});
