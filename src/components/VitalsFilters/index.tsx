import React from 'react';
import { View, Pressable, ScrollView, ScrollViewProps, ViewStyle } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './styles';
import type {
  VitalsFiltersProps,
  VitalsFilterOption,
  VitalsFilterValue,
} from '@/types/components/VitalsFilters';

const DEFAULT_OPTIONS: VitalsFilterOption[] = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
];

const VitalsFilters: React.FC<VitalsFiltersProps> = ({
  value,
  onChange,
  testID,
  scrollable = true,
  compact = true,
  options = DEFAULT_OPTIONS,
}) => {
  const handlePress = (next: VitalsFilterValue) => {
    if (value === next) onChange('all');
    else onChange(next);
  };

  if (scrollable) {
    const svProps: ScrollViewProps = {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      style: styles.scrollRoot,
      contentContainerStyle: [
        styles.containerBase,
        compact ? styles.containerCompact : styles.containerCozy,
      ],
    };
    return (
      <ScrollView {...svProps} testID={testID || 'vitals-filters'}>
        {options.map((opt, idx) => {
          const selected = value === opt.value;
          const isLast = idx === options.length - 1;
          return (
            <Pressable
              key={opt.value}
              onPress={() => handlePress(opt.value)}
              style={[
                styles.chip,
                compact ? styles.chipCompact : styles.chipCozy,
                selected && styles.chipSelected,
                !isLast && styles.chipSpacing,
              ]}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
            >
              <CustomText
                variant="body"
                weight={selected ? 'bold' : 'regular'}
                color={selected ? 'white' : 'text'}
                style={compact ? styles.chipLabelCompact : styles.chipLabelCozy}
              >
                {opt.label}
              </CustomText>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  }
  const viewStyle: ViewStyle = [
    styles.containerBase,
    compact ? styles.containerCompact : styles.containerCozy,
    styles.rowWrap,
  ] as unknown as ViewStyle;

  return (
    <View style={viewStyle} testID={testID || 'vitals-filters'}>
      {options.map((opt, idx) => {
        const selected = value === opt.value;
        const isLast = idx === options.length - 1;
        return (
          <Pressable
            key={opt.value}
            onPress={() => handlePress(opt.value)}
            style={[
              styles.chip,
              compact ? styles.chipCompact : styles.chipCozy,
              selected && styles.chipSelected,
              !isLast && styles.chipSpacing,
            ]}
          >
            <CustomText
              variant="body"
              weight={selected ? 'bold' : 'regular'}
              color={selected ? 'white' : 'text'}
              style={compact ? styles.chipLabelCompact : styles.chipLabelCozy}
            >
              {opt.label}
            </CustomText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default VitalsFilters;
