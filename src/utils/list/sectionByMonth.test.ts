import { groupByMonth } from './sectionByMonth';

type Item = { id: string; dateISO: string };

const mk = (id: string, dateISO: string): Item => ({ id, dateISO });

const getISO = (item: Item) => item.dateISO;

describe('groupByMonth()', () => {
  it('retorna array vazio para lista vazia', () => {
    expect(groupByMonth([], getISO)).toEqual([]);
  });

  it('agrupa itens do mesmo mês em uma única seção', () => {
    const items = [
      mk('a', '2025-03-10T00:00:00.000Z'),
      mk('b', '2025-03-20T00:00:00.000Z'),
    ];
    const sections = groupByMonth(items, getISO);
    expect(sections).toHaveLength(1);
    expect(sections[0].key).toBe('2025-03');
    expect(sections[0].data).toHaveLength(2);
  });

  it('cria seções separadas para meses distintos e as ordena desc', () => {
    const items = [
      mk('jan', '2025-01-15T00:00:00.000Z'),
      mk('mar', '2025-03-15T00:00:00.000Z'),
      mk('feb', '2025-02-15T00:00:00.000Z'),
    ];
    const sections = groupByMonth(items, getISO);
    expect(sections).toHaveLength(3);
    expect(sections[0].key).toBe('2025-03');
    expect(sections[1].key).toBe('2025-02');
    expect(sections[2].key).toBe('2025-01');
  });

  it('ordena itens dentro de cada seção por data desc', () => {
    const items = [
      mk('early', '2025-03-05T00:00:00.000Z'),
      mk('late', '2025-03-25T00:00:00.000Z'),
      mk('mid', '2025-03-15T00:00:00.000Z'),
    ];
    const sections = groupByMonth(items, getISO);
    const ids = sections[0].data.map((i) => i.id);
    expect(ids).toEqual(['late', 'mid', 'early']);
  });

  it('usa monthLabel customizado se fornecido', () => {
    const items = [mk('a', '2025-03-10T00:00:00.000Z')];
    const label = (key: string) => `Custom: ${key}`;
    const sections = groupByMonth(items, getISO, label);
    expect(sections[0].title).toBe('Custom: 2025-03');
  });

  it('gera título padrão em português quando sem label customizado', () => {
    const items = [mk('a', '2025-03-10T00:00:00.000Z')];
    const sections = groupByMonth(items, getISO);
    expect(sections[0].title).toBe('Março 2025');
  });
});
