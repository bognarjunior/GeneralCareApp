import React, { useMemo, useState } from 'react';
import { SectionList, View, ActivityIndicator, SectionListData } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Container from '@/components/Container';
import Header from '@/components/Header';
import IconButton from '@/components/IconButton';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import { useMeasurements } from '@/hooks/useMeasurements';
import type { PersonStackParamList } from '@/types/navigation';
import styles from './styles';
import MeasurementFormSheet from './components/FormSheet';
import type { Measurement } from '@/repositories/measurementsRepository';
import MeasurementsFilters from './components/Filters';
import MeasurementCard from '@/components/MeasurementCard';

import { monthLabelFromYYYYMM } from '@/utils/date';
import { groupByMonth, MonthSection } from '@/utils/list/sectionByMonth';
import ListFooterProgress from '@/components/ListFooterProgress';

type RP = RouteProp<PersonStackParamList, 'Measurements'>;

const MeasurementsScreen: React.FC = () => {
  const { params } = useRoute<RP>();
  const navigation = useNavigation<any>();

  const {
    items,
    loading,
    refresh,
    remove,
    filter,
    setFilter,
    loadMore,
    hasMore,
  } = useMeasurements(params.personId);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editing, setEditing] = useState<Measurement | null>(null);

  function openCreate() {
    setEditing(null);
    setSheetVisible(true);
  }
  function openEdit(item: Measurement) {
    setEditing(item);
    setSheetVisible(true);
  }
  function closeSheet() {
    setSheetVisible(false);
  }

  const sections = useMemo<MonthSection<Measurement>[]>(() => {
    return groupByMonth(items, (i) => i.dateISO, monthLabelFromYYYYMM);
  }, [items]);

  const showEmpty = !loading && items.length === 0 && filter === 'all';
  const showNoMatch = !loading && items.length === 0 && filter !== 'all';

  return (
    <Container>
      <Header
        title="Medições"
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
        rightContent={
          <IconButton
            iconName="add"
            onPress={openCreate}
            backgroundColor="transparent"
            iconColor={theme.colors.text}
            textColor={theme.colors.text}
            testID="m-open-create"
          />
        }
      />

      <MeasurementsFilters value={filter} onChange={setFilter} testID="measurements-filters" />

      {loading && items.length === 0 ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : showEmpty ? (
        <View style={styles.empty}>
          <CustomText variant="subtitle" color="muted" style={styles.emptyText}>
            Nenhuma medição cadastrada.
          </CustomText>
          <IconButton
            iconName="add"
            label="Adicionar medição"
            onPress={openCreate}
            testID="m-empty-add"
          />
        </View>
      ) : showNoMatch ? (
        <View style={styles.empty}>
          <CustomText variant="subtitle" color="muted" style={styles.emptyText}>
            Nada encontrado neste período.
          </CustomText>
        </View>
      ) : (
        <SectionList
          sections={sections as unknown as SectionListData<Measurement>[]}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (!loading && hasMore) loadMore();
          }}
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
              <MeasurementCard
                item={item}
                onEdit={openEdit}
                onDelete={remove}
                testID="m-card"
              />
            </View>
          )}
        />
      )}

      <MeasurementFormSheet
        visible={sheetVisible}
        onClose={closeSheet}
        personId={params.personId}
        preset={editing}
        onSaved={refresh}
      />
    </Container>
  );
};

export default MeasurementsScreen;
