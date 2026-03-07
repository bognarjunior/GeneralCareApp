import React, { useMemo, useState } from 'react';
import { SectionList, View, ActivityIndicator, SectionListData } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Container from '@/components/Container';
import Header from '@/components/Header';
import CustomText from '@/components/CustomText';
import VitalsFilters from '@/components/VitalsFilters';
import ListFooterProgress from '@/components/ListFooterProgress';
import IconButton from '@/components/IconButton';
import theme from '@/theme';
import styles from './styles';

import { useMedicationIntakes } from '@/hooks/useMedicationIntakes';
import type { MedicationHistoryRouteProps } from '@/types/navigation';
import type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

import { groupByMonth, MonthSection } from '@/utils/list/sectionByMonth';
import { monthLabelFromYYYYMM, formatISOToDDMMYYYY_HHmm } from '@/utils/date';
import IntakeFormSheet from '@/screens/Medications/components/IntakeFormSheet';

const MedicationHistoryScreen: React.FC = () => {
  const { params } = useRoute<MedicationHistoryRouteProps>();
  const navigation = useNavigation<any>();

  const {
    items: allIntakes,
    loading,
    refresh,
    remove,
    filter,
    setFilter,
    loadMore,
    hasMore,
  } = useMedicationIntakes(params.personId);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editing, setEditing] = useState<MedicationIntake | null>(null);

  function openEdit(item: MedicationIntake) { setEditing(item); setSheetVisible(true); }
  function closeSheet() { setSheetVisible(false); }

  const items = useMemo(
    () => allIntakes.filter((i) => i.medicationId === params.medicationId),
    [allIntakes, params.medicationId],
  );

  const sections = useMemo<MonthSection<MedicationIntake>[]>(
    () => groupByMonth(items, (i) => i.dateISO, monthLabelFromYYYYMM),
    [items],
  );

  const showEmpty = !loading && items.length === 0;

  return (
    <Container>
      <Header
        title={params.medicationName}
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <VitalsFilters value={filter} onChange={setFilter} testID="history-filters" />

      {loading && items.length === 0 ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : showEmpty ? (
        <View style={styles.empty}>
          <CustomText variant="subtitle" color="muted">
            Nenhuma tomada registrada neste período.
          </CustomText>
        </View>
      ) : (
        <SectionList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          sections={sections as unknown as SectionListData<MedicationIntake>[]}
          keyExtractor={(i) => i.id}
          stickySectionHeadersEnabled
          onEndReachedThreshold={0.3}
          onEndReached={() => { if (!loading && hasMore) loadMore(); }}
          refreshing={loading}
          onRefresh={refresh}
          ListFooterComponent={<ListFooterProgress hasMore={hasMore} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <CustomText weight="bold" variant="subtitle">{section.title}</CustomText>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemSpacing}>
              <View style={styles.intakeRow} testID="history-card">
                <View style={styles.intakeInfo}>
                  <CustomText variant="body" weight="semibold">
                    {formatISOToDDMMYYYY_HHmm(item.dateISO)}
                  </CustomText>
                  {item.scheduledTime ? (
                    <CustomText variant="caption" color="muted">
                      Horário planejado: {item.scheduledTime}
                    </CustomText>
                  ) : null}
                  {item.notes ? (
                    <CustomText variant="caption" color="muted">{item.notes}</CustomText>
                  ) : null}
                </View>
                <View style={styles.intakeActions}>
                  <IconButton
                    iconName="edit"
                    onPress={() => openEdit(item)}
                    backgroundColor="transparent"
                    iconColor={theme.colors.text}
                    textColor={theme.colors.text}
                    iconSize={theme.sizes.icon.md}
                    testID="history-edit"
                  />
                  <IconButton
                    iconName="delete"
                    onPress={() => remove(item.id)}
                    backgroundColor="transparent"
                    iconColor={theme.colors.danger}
                    textColor={theme.colors.danger}
                    iconSize={theme.sizes.icon.md}
                    testID="history-delete"
                  />
                </View>
              </View>
            </View>
          )}
        />
      )}

      <IntakeFormSheet
        visible={sheetVisible}
        onClose={closeSheet}
        personId={params.personId}
        medication={null}
        preset={editing}
        onSaved={refresh}
      />
    </Container>
  );
};

export default MedicationHistoryScreen;
