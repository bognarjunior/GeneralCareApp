import { getInitials } from './name';

describe('getInitials', () => {
  it('pega primeira e última iniciais', () => {
    expect(getInitials('Ana Maria')).toBe('AM');
    expect(getInitials('Carlos Drummond de Andrade')).toBe('CA');
  });

  it('nome único retorna 1 inicial', () => {
    expect(getInitials('joão')).toBe('J');
  });

  it('strings vazias ou espaços retornam vazio', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });

  it('ignora múltiplos espaços', () => {
    expect(getInitials('  Maria   das   Dores  ')).toBe('MD');
  });
});
