import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './styles';

export type MeasurementsFilter = 'today' | '7d' | '30d' | '90d' | 'all';

type Props = {
  value: MeasurementsFilter;
  onChange: (next: MeasurementsFilter) => void;
  testID?: string;
};

const OPTIONS: { key: Exclude<MeasurementsFilter, 'all'>; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: '7d',    label: '7 dias' },
  { key: '30d',   label: '30 dias' },
  { key: '90d',   label: '90 dias' },
];

const MeasurementsFilters: React.FC<Props> = ({ value, onChange, testID = 'measurements-filters' }) => {
  const isActive = (k: MeasurementsFilter) => value === k;

  const handlePress = (k: Exclude<MeasurementsFilter, 'all'>) => {
    if (isActive(k)) onChange('all');
    else onChange(k);
  };

  return (
    <View style={styles.wrapper} testID={testID}>
      {OPTIONS.map((opt) => {
        const active = isActive(opt.key);
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
            onPress={() => handlePress(opt.key)}
            testID={`${testID}-${opt.key}`}
          >
            <CustomText weight={active ? 'bold' : 'regular'} style={styles.chipLabel} color={active ? 'white' : 'text'}>
              {opt.label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MeasurementsFilters;
