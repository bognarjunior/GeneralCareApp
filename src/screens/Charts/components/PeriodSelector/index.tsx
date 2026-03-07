import React from 'react';
import { View, Pressable } from 'react-native';
import CustomText from '@/components/CustomText';
import { type ChartPeriod } from '@/hooks/useChartsData';
import styles from './styles';

const PERIODS: { label: string; value: ChartPeriod }[] = [
  { label: '1 mês', value: '30d' },
  { label: '3 meses', value: '90d' },
  { label: '6 meses', value: '180d' },
];

interface PeriodSelectorProps {
  period: ChartPeriod;
  onChange: (period: ChartPeriod) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ period, onChange }) => (
  <View style={styles.periodRow}>
    {PERIODS.map((p) => (
      <Pressable
        key={p.value}
        style={[styles.periodChip, period === p.value && styles.periodChipActive]}
        onPress={() => onChange(p.value)}
      >
        <CustomText
          style={[
            styles.periodChipText,
            period === p.value && styles.periodChipTextActive,
          ]}
        >
          {p.label}
        </CustomText>
      </Pressable>
    ))}
  </View>
);

export default PeriodSelector;
