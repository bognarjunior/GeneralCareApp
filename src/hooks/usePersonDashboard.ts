import { useEffect, useState } from 'react';
import { list as listGlycemia } from '@/repositories/glycemiaRepository';
import { list as listBloodPressure } from '@/repositories/bloodPressureRepository';
import { list as listMeasurements } from '@/repositories/measurementsRepository';
import { list as listIntakes } from '@/repositories/medicationIntakesRepository';
import { list as listMedications } from '@/repositories/medicationsRepository';
import type { Glycemia } from '@/repositories/glycemiaRepository';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';
import type { Measurement } from '@/repositories/measurementsRepository';

function isToday(dateISO: string): boolean {
  return new Date(dateISO).toDateString() === new Date().toDateString();
}

export interface PersonDashboardData {
  lastGlycemia: Glycemia | null;
  lastBloodPressure: BloodPressure | null;
  lastMeasurement: Measurement | null;
  todayIntakesCount: number;
  activeMedsCount: number;
  loading: boolean;
  refresh: () => void;
}

export function usePersonDashboard(personId: string): PersonDashboardData {
  const [lastGlycemia, setLastGlycemia] = useState<Glycemia | null>(null);
  const [lastBloodPressure, setLastBloodPressure] = useState<BloodPressure | null>(null);
  const [lastMeasurement, setLastMeasurement] = useState<Measurement | null>(null);
  const [todayIntakesCount, setTodayIntakesCount] = useState(0);
  const [activeMedsCount, setActiveMedsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      listGlycemia(personId),
      listBloodPressure(personId),
      listMeasurements(personId),
      listIntakes(personId),
      listMedications(personId),
    ]).then(([gly, bp, meas, intakes, meds]) => {
      if (cancelled) return;
      // Repos return desc order → index 0 is most recent
      setLastGlycemia(gly[0] ?? null);
      setLastBloodPressure(bp[0] ?? null);
      setLastMeasurement(meas[0] ?? null);
      setTodayIntakesCount(intakes.filter((i) => isToday(i.dateISO)).length);
      setActiveMedsCount(meds.filter((m) => m.isActive).length);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [personId, tick]);

  function refresh() {
    setTick((t) => t + 1);
  }

  return {
    lastGlycemia,
    lastBloodPressure,
    lastMeasurement,
    todayIntakesCount,
    activeMedsCount,
    loading,
    refresh,
  };
}
