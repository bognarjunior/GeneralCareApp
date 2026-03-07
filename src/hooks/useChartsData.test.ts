import { renderHook, waitFor } from '@testing-library/react-native';
import { useChartsData } from './useChartsData';
import type { Glycemia } from '@/repositories/glycemiaRepository';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';
import type { Measurement } from '@/repositories/measurementsRepository';

const mockListGly = jest.fn<Promise<Glycemia[]>, [string]>();
const mockListBP = jest.fn<Promise<BloodPressure[]>, [string]>();
const mockListMeas = jest.fn<Promise<Measurement[]>, [string]>();

jest.mock('@/repositories/glycemiaRepository', () => ({
  list: (...args: [string]) => mockListGly(...args),
}));
jest.mock('@/repositories/bloodPressureRepository', () => ({
  list: (...args: [string]) => mockListBP(...args),
}));
jest.mock('@/repositories/measurementsRepository', () => ({
  list: (...args: [string]) => mockListMeas(...args),
}));

const PERSON_ID = 'p1';

const nowISO = new Date().toISOString();
const oldISO = '2000-01-01T00:00:00.000Z';

const mkGly = (id: string, dateISO: string): Glycemia => ({
  id, personId: PERSON_ID, dateISO, valueMgDl: 95,
});

const mkBP = (id: string, dateISO: string): BloodPressure => ({
  id, personId: PERSON_ID, dateISO, systolic: 120, diastolic: 80,
});

const mkMeas = (id: string, dateISO: string): Measurement => ({
  id, personId: PERSON_ID, dateISO, weightKg: 70, heightCm: 170, bmi: 24.22,
});

describe('useChartsData', () => {
  beforeEach(() => {
    mockListGly.mockReset();
    mockListBP.mockReset();
    mockListMeas.mockReset();
  });

  it('começa com loading=true e termina com loading=false', async () => {
    mockListGly.mockResolvedValueOnce([]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useChartsData(PERSON_ID, '30d'));
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('filtra itens fora do período', async () => {
    // Repositories return desc order (newest first)
    mockListGly.mockResolvedValueOnce([mkGly('recent', nowISO), mkGly('old', oldISO)]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useChartsData(PERSON_ID, '30d'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.glycemia.map((g) => g.id)).toEqual(['recent']);
  });

  it('retorna itens em ordem crescente (asc) para os gráficos', async () => {
    // Simulating desc order from repository (newest first)
    const newer = mkGly('newer', nowISO);
    const middleISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const middle = mkGly('middle', middleISO);
    mockListGly.mockResolvedValueOnce([newer, middle]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useChartsData(PERSON_ID, '30d'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After reverse(), should be asc: middle first, newer last
    expect(result.current.glycemia[0].id).toBe('middle');
    expect(result.current.glycemia[1].id).toBe('newer');
  });

  it('recarrega quando o período muda', async () => {
    mockListGly.mockResolvedValue([]);
    mockListBP.mockResolvedValue([]);
    mockListMeas.mockResolvedValue([]);

    const { rerender } = renderHook(
      ({ period }: { period: '30d' | '90d' | '180d' }) => useChartsData(PERSON_ID, period),
      { initialProps: { period: '30d' as const } },
    );

    await waitFor(() => expect(mockListGly).toHaveBeenCalledTimes(1));

    rerender({ period: '90d' });
    await waitFor(() => expect(mockListGly).toHaveBeenCalledTimes(2));
  });

  it('carrega dados dos três repositórios', async () => {
    mockListGly.mockResolvedValueOnce([mkGly('g1', nowISO)]);
    mockListBP.mockResolvedValueOnce([mkBP('bp1', nowISO)]);
    mockListMeas.mockResolvedValueOnce([mkMeas('m1', nowISO)]);

    const { result } = renderHook(() => useChartsData(PERSON_ID, '30d'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.glycemia).toHaveLength(1);
    expect(result.current.bloodPressure).toHaveLength(1);
    expect(result.current.measurements).toHaveLength(1);
  });
});
