import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Container from '@/components/Container';
import Header from '@/components/Header';
import theme from '@/theme';
import styles from './styles';

import { usePersonDashboard } from '@/hooks/usePersonDashboard';
import { formatSummaryDate, glycemiaStatusColor, bpStatusColor } from '@/utils/dashboard';
import type { DashboardRouteProps, PersonStackNavigationProps } from '@/types/navigation';

import SummaryCard from './components/SummaryCard';

const DashboardScreen: React.FC = () => {
  const { params } = useRoute<DashboardRouteProps>();
  const navigation = useNavigation<PersonStackNavigationProps>();

  const {
    lastGlycemia,
    lastBloodPressure,
    lastMeasurement,
    todayIntakesCount,
    activeMedsCount,
    loading,
  } = usePersonDashboard(params.personId);

  return (
    <Container>
      <Header
        title="Resumo"
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
      />

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
          <View style={styles.grid}>
            <SummaryCard
              iconName="bloodtype"
              label="Glicemia"
              value={lastGlycemia ? `${lastGlycemia.valueMgDl} mg/dL` : '—'}
              subValue={lastGlycemia ? formatSummaryDate(lastGlycemia.dateISO) : 'Sem registros'}
              stripeColor={lastGlycemia ? glycemiaStatusColor(lastGlycemia.valueMgDl) : theme.colors.border}
              onPress={() => navigation.navigate('Glycemia', { personId: params.personId })}
            />

            <SummaryCard
              iconName="monitor-heart"
              label="Pressão Arterial"
              value={lastBloodPressure ? `${lastBloodPressure.systolic}/${lastBloodPressure.diastolic} mmHg` : '—'}
              subValue={lastBloodPressure ? formatSummaryDate(lastBloodPressure.dateISO) : 'Sem registros'}
              stripeColor={
                lastBloodPressure
                  ? bpStatusColor(lastBloodPressure.systolic, lastBloodPressure.diastolic)
                  : theme.colors.border
              }
              onPress={() => navigation.navigate('BloodPressure', { personId: params.personId })}
            />

            <SummaryCard
              iconName="monitor-weight"
              label="Peso"
              value={lastMeasurement ? `${lastMeasurement.weightKg} kg` : '—'}
              subValue={
                lastMeasurement
                  ? `IMC ${lastMeasurement.bmi} · ${formatSummaryDate(lastMeasurement.dateISO)}`
                  : 'Sem registros'
              }
              stripeColor={lastMeasurement ? theme.colors.secondary : theme.colors.border}
              onPress={() => navigation.navigate('Measurements', { personId: params.personId })}
            />

            <SummaryCard
              iconName="medical-services"
              label="Medicamentos hoje"
              value={`${todayIntakesCount} tomada${todayIntakesCount !== 1 ? 's' : ''}`}
              subValue={
                activeMedsCount > 0
                  ? `${activeMedsCount} ativo${activeMedsCount !== 1 ? 's' : ''}`
                  : 'Nenhum ativo'
              }
              stripeColor={
                activeMedsCount === 0
                  ? theme.colors.border
                  : todayIntakesCount >= activeMedsCount
                  ? theme.colors.success
                  : theme.colors.warning
              }
              onPress={() => navigation.navigate('Medications', { personId: params.personId })}
            />
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

export default DashboardScreen;
