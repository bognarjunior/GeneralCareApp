import React from 'react';
import { ScrollView, View, Pressable, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Container from '@/components/Container';
import Header from '@/components/Header';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';

import { usePersonDashboard } from '@/hooks/usePersonDashboard';
import { classify } from '@/repositories/bloodPressureRepository';
import type { PersonStackParamList } from '@/types/navigation';

type RP = RouteProp<PersonStackParamList, 'Dashboard'>;

function formatSummaryDate(dateISO: string): string {
  const d = new Date(dateISO);
  const now = new Date();
  const hhmm = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (d.toDateString() === now.toDateString()) return `Hoje, ${hhmm}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Ontem, ${hhmm}`;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function glycemiaStatusColor(value: number): string {
  if (value < 70 || value >= 140) return theme.colors.danger;
  if (value >= 100) return theme.colors.warning;
  return theme.colors.success;
}

function bpStatusColor(systolic: number, diastolic: number): string {
  const c = classify(systolic, diastolic);
  if (c === 'normal') return theme.colors.success;
  if (c === 'hypertension_2') return theme.colors.danger;
  return theme.colors.warning;
}

interface SummaryCardProps {
  iconName: string;
  label: string;
  value: string;
  subValue: string;
  stripeColor: string;
  onPress?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  iconName, label, value, subValue, stripeColor, onPress,
}) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={[styles.cardStripe, { backgroundColor: stripeColor }]} />
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <Icon name={iconName} size={14} color={theme.colors.muted} />
        <CustomText variant="caption" color="muted">{label}</CustomText>
      </View>
      <CustomText weight="bold" style={styles.cardValue}>{value}</CustomText>
      <CustomText variant="caption" color="muted">{subValue}</CustomText>
    </View>
  </Pressable>
);

const DashboardScreen: React.FC = () => {
  const { params } = useRoute<RP>();
  const navigation = useNavigation<any>();

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
