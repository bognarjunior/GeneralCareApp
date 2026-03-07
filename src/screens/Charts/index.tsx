import React, { useState } from 'react';
import { ScrollView, View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';

import Container from '@/components/Container';
import Header from '@/components/Header';
import theme from '@/theme';
import styles, { AXIS_TEXT_STYLE, REF_DASHED, REF_LABEL_SUCCESS, REF_LABEL_WARNING } from './styles';

import { useChartsData, type ChartPeriod } from '@/hooks/useChartsData';
import type { ChartsRouteProps, PersonStackNavigationProps } from '@/types/navigation';
import { toGlycemiaPoints, toSystolicPoints, toDiastolicPoints, toWeightPoints } from '@/utils/charts';

import PeriodSelector from './components/PeriodSelector';
import ChartSection from './components/ChartSection';

const CHART_HORIZONTAL_PADDING = theme.spacing.lg * 2 + theme.spacing.xs;

const ChartsScreen: React.FC = () => {
  const { params } = useRoute<ChartsRouteProps>();
  const navigation = useNavigation<PersonStackNavigationProps>();
  const { width } = useWindowDimensions();

  const [period, setPeriod] = useState<ChartPeriod>('30d');
  const { glycemia, bloodPressure, measurements, loading } = useChartsData(params.personId, period);

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

      <PeriodSelector period={period} onChange={setPeriod} />

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
          <ChartSection
            title="Glicemia (mg/dL)"
            legend={[
              { indicatorStyle: styles.legendDotPrimary, label: 'Valor' },
              { indicatorStyle: styles.legendDashSuccess, label: 'Normal em jejum (70–99)' },
              { indicatorStyle: styles.legendDashWarning, label: 'Limite pós-prandial (140)' },
            ]}
            empty={glycemiaPoints.length === 0}
          >
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
              referenceLine1Config={{ ...REF_DASHED, color: theme.colors.success, labelText: '70', labelTextStyle: REF_LABEL_SUCCESS }}
              showReferenceLine2
              referenceLine2Position={99}
              referenceLine2Config={{ ...REF_DASHED, color: theme.colors.success, labelText: '99', labelTextStyle: REF_LABEL_SUCCESS }}
              showReferenceLine3
              referenceLine3Position={140}
              referenceLine3Config={{ ...REF_DASHED, color: theme.colors.warning, labelText: '140', labelTextStyle: REF_LABEL_WARNING }}
            />
          </ChartSection>

          <ChartSection
            title="Pressão Arterial (mmHg)"
            legend={[
              { indicatorStyle: styles.legendDotDanger, label: 'Sistólica' },
              { indicatorStyle: styles.legendDotInfo, label: 'Diastólica' },
              { indicatorStyle: styles.legendDashSuccess, label: 'Limite normal (120/80)' },
            ]}
            empty={systolicPoints.length === 0}
          >
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
              referenceLine1Config={{ ...REF_DASHED, color: theme.colors.success, labelText: '120', labelTextStyle: REF_LABEL_SUCCESS }}
              showReferenceLine2
              referenceLine2Position={80}
              referenceLine2Config={{ ...REF_DASHED, color: theme.colors.success, labelText: '80', labelTextStyle: REF_LABEL_SUCCESS }}
            />
          </ChartSection>

          <ChartSection
            title="Peso (kg)"
            legend={[
              { indicatorStyle: styles.legendDotSecondary, label: 'Peso' },
            ]}
            empty={weightPoints.length === 0}
          >
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
          </ChartSection>
        </ScrollView>
      )}
    </Container>
  );
};

export default ChartsScreen;
