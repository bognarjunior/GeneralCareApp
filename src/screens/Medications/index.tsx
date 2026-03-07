import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Container from '@/components/Container';
import Header from '@/components/Header';
import IconButton from '@/components/IconButton';
import CustomText from '@/components/CustomText';
import MedicationCard from '@/components/MedicationCard';
import theme from '@/theme';
import styles from './styles';

import { useMedications } from '@/hooks/useMedications';
import { useMedicationIntakes } from '@/hooks/useMedicationIntakes';
import type { MedicationsRouteProps, RootStackParamList } from '@/types/navigation';
import type { Medication } from '@/repositories/medicationsRepository';
import type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

import MedicationFormSheet from './components/MedicationFormSheet';
import IntakeFormSheet from './components/IntakeFormSheet';

const MedicationsScreen: React.FC = () => {
  const { params } = useRoute<MedicationsRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    items: medications,
    loading: medLoading,
    refresh: refreshMeds,
    remove: removeMed,
  } = useMedications(params.personId);

  const {
    items: todayIntakes,
    loading: intakeLoading,
    refresh: refreshIntakes,
    setFilter,
  } = useMedicationIntakes(params.personId);

  useEffect(() => {
    setFilter('today');
  }, [setFilter]);

  const [medSheetVisible, setMedSheetVisible] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const [intakeSheetVisible, setIntakeSheetVisible] = useState(false);
  const [intakeMedication, setIntakeMedication] = useState<Medication | null>(null);
  const [editingIntake, setEditingIntake] = useState<MedicationIntake | null>(null);

  function openCreateMed() { setEditingMed(null); setMedSheetVisible(true); }
  function openEditMed(item: Medication) { setEditingMed(item); setMedSheetVisible(true); }
  function closeMedSheet() { setMedSheetVisible(false); }

  function openLogIntake(medication: Medication) {
    setIntakeMedication(medication);
    setEditingIntake(null);
    setIntakeSheetVisible(true);
  }
  function closeIntakeSheet() { setIntakeSheetVisible(false); }

  function openHistory(medication: Medication) {
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate(
      'MedicationHistory',
      {
        personId: params.personId,
        medicationId: medication.id,
        medicationName: medication.name,
      },
    );
  }

  const loading = medLoading || intakeLoading;
  const showEmpty = !loading && medications.length === 0;

  const allTodayIntakes = useMemo(() => todayIntakes as MedicationIntake[], [todayIntakes]);

  return (
    <Container>
      <Header
        title="Medicamentos"
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
        rightContent={
          <IconButton
            iconName="add"
            onPress={openCreateMed}
            backgroundColor="transparent"
            iconColor={theme.colors.text}
            textColor={theme.colors.text}
            testID="med-open-create"
          />
        }
      />

      {loading && medications.length === 0 ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : showEmpty ? (
        <View style={styles.empty}>
          <CustomText variant="subtitle" color="muted">
            Nenhum medicamento cadastrado.
          </CustomText>
          <IconButton
            iconName="add"
            label="Adicionar medicamento"
            onPress={openCreateMed}
            testID="med-empty-add"
          />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={medications}
          keyExtractor={(m) => m.id}
          refreshing={loading}
          onRefresh={() => { refreshMeds(); refreshIntakes(); }}
          renderItem={({ item }) => (
            <View style={styles.itemSpacing}>
              <MedicationCard
                item={item}
                todayIntakes={allTodayIntakes}
                onEdit={openEditMed}
                onDelete={removeMed}
                onLogIntake={openLogIntake}
                onViewHistory={openHistory}
                testID="med-card"
              />
            </View>
          )}
        />
      )}

      <MedicationFormSheet
        visible={medSheetVisible}
        onClose={closeMedSheet}
        personId={params.personId}
        preset={editingMed}
        onSaved={refreshMeds}
      />

      <IntakeFormSheet
        visible={intakeSheetVisible}
        onClose={closeIntakeSheet}
        personId={params.personId}
        medication={intakeMedication}
        preset={editingIntake}
        onSaved={refreshIntakes}
      />
    </Container>
  );
};

export default MedicationsScreen;
