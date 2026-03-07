import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './styles';

export interface LegendItem {
  indicatorStyle: StyleProp<ViewStyle>;
  label: string;
}

interface ChartSectionProps {
  title: string;
  legend: LegendItem[];
  empty: boolean;
  children: React.ReactNode;
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, legend, empty, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <CustomText weight="bold" variant="subtitle">{title}</CustomText>
      <View style={styles.legend}>
        {legend.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={item.indicatorStyle} />
            <CustomText variant="caption" color="muted">{item.label}</CustomText>
          </View>
        ))}
      </View>
    </View>

    {empty ? (
      <View style={styles.empty}>
        <CustomText color="muted">Sem registros neste período</CustomText>
      </View>
    ) : (
      <View style={styles.chartWrap}>{children}</View>
    )}
  </View>
);

export default ChartSection;
