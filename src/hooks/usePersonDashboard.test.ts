import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePersonDashboard } from './usePersonDashboard';
import type { Glycemia } from '@/repositories/glycemiaRepository';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';
import type { Measurement } from '@/repositories/measurementsRepository';

const mockListGly = jest.fn<Promise<Glycemia[]>, [string]>();
const mockListBP = jest.fn<Promise<BloodPressure[]>, [string]>();
const mockListMeas = jest.fn<Promise<Measurement[]>, [string]>();
const mockListIntakes = jest.fn();
const mockListMeds = jest.fn();

jest.mock('@/repositories/glycemiaRepository', () => ({
  list: (...args: [string]) => mockListGly(...args),
}));
jest.mock('@/repositories/bloodPressureRepository', () => ({
  list: (...args: [string]) => mockListBP(...args),
}));
jest.mock('@/repositories/measurementsRepository', () => ({
  list: (...args: [string]) => mockListMeas(...args),
}));
jest.mock('@/repositories/medicationIntakesRepository', () => ({
  list: (...args: unknown[]) => mockListIntakes(...args),
}));
jest.mock('@/repositories/medicationsRepository', () => ({
  list: (...args: unknown[]) => mockListMeds(...args),
}));

const PERSON_ID = 'p1';
const todayISO = new Date().toISOString();
const oldISO = '2000-01-01T00:00:00.000Z';

const mkGly = (id: string, dateISO = todayISO): Glycemia => ({
  id, personId: PERSON_ID, dateISO, valueMgDl: 95,
});

const mkBP = (id: string, dateISO = todayISO): BloodPressure => ({
  id, personId: PERSON_ID, dateISO, systolic: 120, diastolic: 80,
});

const mkMeas = (id: string, dateISO = todayISO): Measurement => ({
  id, personId: PERSON_ID, dateISO, weightKg: 70, heightCm: 170, bmi: 24.22,
});

const mkIntake = (id: string, dateISO = todayISO) => ({ id, personId: PERSON_ID, dateISO });
const mkMed = (id: string, isActive = true) => ({ id, personId: PERSON_ID, isActive });

describe('usePersonDashboard', () => {
  beforeEach(() => {
    mockListGly.mockReset();
    mockListBP.mockReset();
    mockListMeas.mockReset();
    mockListIntakes.mockReset();
    mockListMeds.mockReset();
  });

  it('começa com loading=true e termina com loading=false', async () => {
    mockListGly.mockResolvedValueOnce([]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);
    mockListIntakes.mockResolvedValueOnce([]);
    mockListMeds.mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePersonDashboard(PERSON_ID));
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('expõe o item mais recente de cada repositório (índice 0 = mais novo)', async () => {
    const gly1 = mkGly('g1', '2025-06-01T00:00:00.000Z');
    const gly2 = mkGly('g2', '2025-01-01T00:00:00.000Z');
    const bp1 = mkBP('bp1', '2025-06-01T00:00:00.000Z');
    const meas1 = mkMeas('m1', '2025-05-01T00:00:00.000Z');

    mockListGly.mockResolvedValueOnce([gly1, gly2]); // desc: g1 first
    mockListBP.mockResolvedValueOnce([bp1]);
    mockListMeas.mockResolvedValueOnce([meas1]);
    mockListIntakes.mockResolvedValueOnce([]);
    mockListMeds.mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePersonDashboard(PERSON_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.lastGlycemia?.id).toBe('g1');
    expect(result.current.lastBloodPressure?.id).toBe('bp1');
    expect(result.current.lastMeasurement?.id).toBe('m1');
  });

  it('expõe null quando repositórios estão vazios', async () => {
    mockListGly.mockResolvedValueOnce([]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);
    mockListIntakes.mockResolvedValueOnce([]);
    mockListMeds.mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePersonDashboard(PERSON_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.lastGlycemia).toBeNull();
    expect(result.current.lastBloodPressure).toBeNull();
    expect(result.current.lastMeasurement).toBeNull();
  });

  it('conta apenas intakes de hoje', async () => {
    mockListGly.mockResolvedValueOnce([]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);
    mockListIntakes.mockResolvedValueOnce([
      mkIntake('i1', todayISO),
      mkIntake('i2', todayISO),
      mkIntake('i3', oldISO), // not today
    ]);
    mockListMeds.mockResolvedValueOnce([]);

    const { result } = renderHook(() => usePersonDashboard(PERSON_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.todayIntakesCount).toBe(2);
  });

  it('conta apenas medicamentos ativos', async () => {
    mockListGly.mockResolvedValueOnce([]);
    mockListBP.mockResolvedValueOnce([]);
    mockListMeas.mockResolvedValueOnce([]);
    mockListIntakes.mockResolvedValueOnce([]);
    mockListMeds.mockResolvedValueOnce([
      mkMed('m1', true),
      mkMed('m2', true),
      mkMed('m3', false), // inactive
    ]);

    const { result } = renderHook(() => usePersonDashboard(PERSON_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.activeMedsCount).toBe(2);
  });

  it('refresh() recarrega os dados', async () => {
    mockListGly.mockResolvedValue([]);
    mockListBP.mockResolvedValue([]);
    mockListMeas.mockResolvedValue([]);
    mockListIntakes.mockResolvedValue([]);
    mockListMeds.mockResolvedValue([]);

    const { result } = renderHook(() => usePersonDashboard(PERSON_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockListGly).toHaveBeenCalledTimes(1);

    await act(async () => { result.current.refresh(); });
    await waitFor(() => expect(mockListGly).toHaveBeenCalledTimes(2));
  });
});
