import React, { useState } from 'react';
import {
  ScrollView,
  View,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';

import Container from '@/components/Container';
import Header from '@/components/Header';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';

import { useChartsData, type ChartPeriod } from '@/hooks/useChartsData';
import type { ChartsRouteProps } from '@/types/navigation';
import type { Glycemia } from '@/repositories/glycemiaRepository';
import type { BloodPressure } from '@/repositories/bloodPressureRepository';
import type { Measurement } from '@/repositories/measurementsRepository';

const PERIODS: { label: string; value: ChartPeriod }[] = [
  { label: '1 mês', value: '30d' },
  { label: '3 meses', value: '90d' },
  { label: '6 meses', value: '180d' },
];

const CHART_HORIZONTAL_PADDING = theme.spacing.lg * 2 + theme.spacing.xs;

function labelForIndex(index: number, total: number, dateISO: string): string {
  if (total <= 7) return formatDateLabel(dateISO);
  if (total <= 20 && index % 3 === 0) return formatDateLabel(dateISO);
  if (total <= 60 && index % 7 === 0) return formatDateLabel(dateISO);
  if (index % 14 === 0) return formatDateLabel(dateISO);
  return '';
}

function formatDateLabel(dateISO: string): string {
  const d = new Date(dateISO);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function toGlycemiaPoints(items: Glycemia[]) {
  return items.map((item, i) => ({
    value: item.valueMgDl,
    label: labelForIndex(i, items.length, item.dateISO),
  }));
}

function toSystolicPoints(items: BloodPressure[]) {
  return items.map((item, i) => ({
    value: item.systolic,
    label: labelForIndex(i, items.length, item.dateISO),
  }));
}

function toDiastolicPoints(items: BloodPressure[]) {
  return items.map((item) => ({
    value: item.diastolic,
    label: '',
  }));
}

function toWeightPoints(items: Measurement[]) {
  return items.map((item, i) => ({
    value: item.weightKg,
    label: labelForIndex(i, items.length, item.dateISO),
  }));
}

const AXIS_TEXT_STYLE = {
  color: theme.colors.muted,
  fontSize: 9,
  fontFamily: theme.fonts.family.regular,
};

const REF_DASHED = {
  type: 'dashed' as const,
  dashWidth: 4,
  dashGap: 4,
  thickness: 1,
};

const ChartsScreen: React.FC = () => {
  const { params } = useRoute<ChartsRouteProps>();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const [period, setPeriod] = useState<ChartPeriod>('30d');
  const { glycemia, bloodPressure, measurements, loading } = useChartsData(
    params.personId,
    period,
  );

  const chartWidth = width - CHART_HORIZONTAL_PADDING;

  const glycemiaPoints = toGlycemiaPoints(glycemia);
  const systolicPoints = toSystolicPoints(bloodPressure);
  const diastolicPoints = toDiastolicPoints(bloodPressure);
  const weightPoints = toWeightPoints(measurements);

  return (
    <Container>
      <Header
        title="Gráficos"
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable
            key={p.value}
            style={[styles.periodChip, period === p.value && styles.periodChipActive]}
            onPress={() => setPeriod(p.value)}
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

      {loading ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Glicemia */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CustomText weight="bold" variant="subtitle">
                Glicemia (mg/dL)
              </CustomText>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                  <CustomText variant="caption" color="muted">Valor</CustomText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDash, { borderColor: theme.colors.success }]} />
                  <CustomText variant="caption" color="muted">Normal jejum (70–99)</CustomText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDash, { borderColor: theme.colors.warning }]} />
                  <CustomText variant="caption" color="muted">Limite pós-prandial (140)</CustomText>
                </View>
              </View>
            </View>

            {glycemiaPoints.length === 0 ? (
              <View style={styles.empty}>
                <CustomText color="muted">Sem registros neste período</CustomText>
              </View>
            ) : (
              <View style={styles.chartWrap}>
                <LineChart
                  data={glycemiaPoints}
                  width={chartWidth}
                  height={180}
                  areaChart
                  color={theme.colors.primary}
                  startFillColor={theme.colors.primary}
                  endFillColor={theme.colors.primary}
                  startOpacity={0.25}
                  endOpacity={0.02}
                  thickness={2}
                  hideDataPoints={glycemiaPoints.length > 15}
                  dataPointsColor={theme.colors.primary}
                  dataPointsRadius={3}
                  noOfSections={4}
                  rulesType="solid"
                  rulesColor={theme.colors.border}
                  yAxisColor={theme.colors.border}
                  xAxisColor={theme.colors.border}
                  yAxisTextStyle={AXIS_TEXT_STYLE}
                  xAxisLabelTextStyle={AXIS_TEXT_STYLE}
                  showReferenceLine1
                  referenceLine1Position={70}
                  referenceLine1Config={{
                    ...REF_DASHED,
                    color: theme.colors.success,
                    labelText: '70',
                    labelTextStyle: { color: theme.colors.success, fontSize: 9 },
                  }}
                  showReferenceLine2
                  referenceLine2Position={99}
                  referenceLine2Config={{
                    ...REF_DASHED,
                    color: theme.colors.success,
                    labelText: '99',
                    labelTextStyle: { color: theme.colors.success, fontSize: 9 },
                  }}
                  showReferenceLine3
                  referenceLine3Position={140}
                  referenceLine3Config={{
                    ...REF_DASHED,
                    color: theme.colors.warning,
                    labelText: '140',
                    labelTextStyle: { color: theme.colors.warning, fontSize: 9 },
                  }}
                />
              </View>
            )}
          </View>

          {/* Pressão Arterial */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CustomText weight="bold" variant="subtitle">
                Pressão Arterial (mmHg)
              </CustomText>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.danger }]} />
                  <CustomText variant="caption" color="muted">Sistólica</CustomText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.info }]} />
                  <CustomText variant="caption" color="muted">Diastólica</CustomText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDash, { borderColor: theme.colors.success }]} />
                  <CustomText variant="caption" color="muted">Limite normal (120/80)</CustomText>
                </View>
              </View>
            </View>

            {systolicPoints.length === 0 ? (
              <View style={styles.empty}>
                <CustomText color="muted">Sem registros neste período</CustomText>
              </View>
            ) : (
              <View style={styles.chartWrap}>
                <LineChart
                  data={systolicPoints}
                  data2={diastolicPoints}
                  width={chartWidth}
                  height={180}
                  color={theme.colors.danger}
                  color2={theme.colors.info}
                  thickness={2}
                  thickness2={2}
                  hideDataPoints={systolicPoints.length > 15}
                  hideDataPoints2={systolicPoints.length > 15}
                  dataPointsColor={theme.colors.danger}
                  dataPointsColor2={theme.colors.info}
                  dataPointsRadius={3}
                  noOfSections={4}
                  rulesType="solid"
                  rulesColor={theme.colors.border}
                  yAxisColor={theme.colors.border}
                  xAxisColor={theme.colors.border}
                  yAxisTextStyle={AXIS_TEXT_STYLE}
                  xAxisLabelTextStyle={AXIS_TEXT_STYLE}
                  showReferenceLine1
                  referenceLine1Position={120}
                  referenceLine1Config={{
                    ...REF_DASHED,
                    color: theme.colors.success,
                    labelText: '120',
                    labelTextStyle: { color: theme.colors.success, fontSize: 9 },
                  }}
                  showReferenceLine2
                  referenceLine2Position={80}
                  referenceLine2Config={{
                    ...REF_DASHED,
                    color: theme.colors.success,
                    labelText: '80',
                    labelTextStyle: { color: theme.colors.success, fontSize: 9 },
                  }}
                />
              </View>
            )}
          </View>

          {/* Peso */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CustomText weight="bold" variant="subtitle">
                Peso (kg)
              </CustomText>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
                  <CustomText variant="caption" color="muted">Peso</CustomText>
                </View>
              </View>
            </View>

            {weightPoints.length === 0 ? (
              <View style={styles.empty}>
                <CustomText color="muted">Sem registros neste período</CustomText>
              </View>
            ) : (
              <View style={styles.chartWrap}>
                <LineChart
                  data={weightPoints}
                  width={chartWidth}
                  height={180}
                  areaChart
                  color={theme.colors.secondary}
                  startFillColor={theme.colors.secondary}
                  endFillColor={theme.colors.secondary}
                  startOpacity={0.25}
                  endOpacity={0.02}
                  thickness={2}
                  hideDataPoints={weightPoints.length > 15}
                  dataPointsColor={theme.colors.secondary}
                  dataPointsRadius={3}
                  noOfSections={4}
                  rulesType="solid"
                  rulesColor={theme.colors.border}
                  yAxisColor={theme.colors.border}
                  xAxisColor={theme.colors.border}
                  yAxisTextStyle={AXIS_TEXT_STYLE}
                  xAxisLabelTextStyle={AXIS_TEXT_STYLE}
                />
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

export default ChartsScreen;
