import { useEffect, useState } from 'react';
import { list as listGlycemia } from '@/repositories/glycemiaRepository';
import { list as listBloodPressure } from '@/repositories/bloodPressureRepository';
import { list as listMeasurements } from '@/repositories/measurementsRepository';
import type { Glycemia } from '@/repositories/glycemiaRepository';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';
import type { Measurement } from '@/repositories/measurementsRepository';

export type ChartPeriod = '30d' | '90d' | '180d';

const PERIOD_DAYS: Record<ChartPeriod, number> = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
};

function cutoffDate(period: ChartPeriod): Date {
  const d = new Date();
  d.setDate(d.getDate() - PERIOD_DAYS[period]);
  return d;
}

function withinPeriod(dateISO: string, cutoff: Date): boolean {
  return new Date(dateISO) >= cutoff;
}

export interface ChartsData {
  glycemia: Glycemia[];
  bloodPressure: BloodPressure[];
  measurements: Measurement[];
  loading: boolean;
}

export function useChartsData(personId: string, period: ChartPeriod): ChartsData {
  const [glycemia, setGlycemia] = useState<Glycemia[]>([]);
  const [bloodPressure, setBloodPressure] = useState<BloodPressure[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const cutoff = cutoffDate(period);

    Promise.all([
      listGlycemia(personId),
      listBloodPressure(personId),
      listMeasurements(personId),
    ]).then(([gly, bp, meas]) => {
      if (cancelled) return;
      // Repositories return desc order; reverse to get asc (oldest → newest) for charts
      setGlycemia(gly.filter((i) => withinPeriod(i.dateISO, cutoff)).reverse());
      setBloodPressure(bp.filter((i) => withinPeriod(i.dateISO, cutoff)).reverse());
      setMeasurements(meas.filter((i) => withinPeriod(i.dateISO, cutoff)).reverse());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [personId, period]);

  return { glycemia, bloodPressure, measurements, loading };
}
