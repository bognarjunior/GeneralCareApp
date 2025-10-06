import { personCreateSchema } from './person';
import { isValidDDMMYYYY } from '@/utils/date';

jest.mock('@/utils/date', () => {
  const real = jest.requireActual('@/utils/date');
  return {
    ...real,
    isValidDDMMYYYY: jest.fn(real.isValidDDMMYYYY),
  };
});

const valid = (data: any) => personCreateSchema.safeParse(data);

describe('personCreateSchema', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-03-15T12:00:00.000Z'));
  });
  afterAll(() => jest.useRealTimers());

  it('valida com sucesso com dados mínimos válidos', () => {
    const res = valid({ fullName: 'Maria Silva' });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.fullName).toBe('Maria Silva');
      expect(res.data.birthDate).toBeUndefined();
      expect(res.data.notes).toBeUndefined();
    }
  });

  it('aplica trim no fullName e exige pelo menos 3 caracteres após trim', () => {
    const res = valid({ fullName: '  Ana  ' });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.fullName).toBe('Ana');
    }

    const short = valid({ fullName: '   ' });
    expect(short.success).toBe(false);
    if (!short.success) {
      expect(short.error.issues[0].message).toBe('Nome muito curto');
      expect(short.error.issues[0].path).toEqual(['fullName']);
    }
  });

  it('fullName vazio falha com "Informe o nome completo"', () => {
    const res = valid({ fullName: '' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Informe o nome completo');
      expect(res.error.issues[0].path).toEqual(['fullName']);
    }
  });

  it('birthDate é opcional; vazio ou ausente é aceito, mas formato inválido é rejeitado', () => {
    expect(valid({ fullName: 'João' }).success).toBe(true);
    expect(valid({ fullName: 'João', birthDate: '' }).success).toBe(true);

    (isValidDDMMYYYY as jest.Mock).mockReturnValueOnce(false);
    const res = valid({ fullName: 'João', birthDate: '31-02-2025' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Use DD/MM/AAAA válido');
      expect(res.error.issues[0].path).toEqual(['birthDate']);
    }
  });

  it('notes aceita até 500 chars; estoura acima disso', () => {
    const ok = 'x'.repeat(500);
    expect(valid({ fullName: 'Carla', notes: ok }).success).toBe(true);

    const tooLong = 'x'.repeat(501);
    const res = valid({ fullName: 'Carla', notes: tooLong });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Máximo de 500 caracteres');
      expect(res.error.issues[0].path).toEqual(['notes']);
    }
  });
});
