import React, { useMemo, useState } from 'react';
import { SectionList, View, ActivityIndicator, SectionListData } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import Container from '@/components/Container';
import Header from '@/components/Header';
import IconButton from '@/components/IconButton';
import CustomText from '@/components/CustomText';
import VitalsFilters from '@/components/VitalsFilters';
import MeasurementCard from '@/components/MeasurementCard';
import ListFooterProgress from '@/components/ListFooterProgress';
import theme from '@/theme';
import styles from './styles';

import { useMeasurements } from '@/hooks/useMeasurements';
import type { PersonStackParamList } from '@/types/navigation';
import type { Measurement } from '@/repositories/measurementsRepository';

import { groupByMonth, MonthSection } from '@/utils/list/sectionByMonth';
import { monthLabelFromYYYYMM } from '@/utils/date';
import MeasurementFormSheet from './components/FormSheet';

type RP = RouteProp<PersonStackParamList, 'Measurements'>;

const MeasurementsScreen: React.FC = () => {
  const { params } = useRoute<RP>();
  const navigation = useNavigation<any>();

  const {
    items, loading, refresh, remove,
    filter, setFilter, loadMore, hasMore,
  } = useMeasurements(params.personId);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editing, setEditing] = useState<Measurement | null>(null);

  function openCreate() { setEditing(null); setSheetVisible(true); }
  function openEdit(item: Measurement) { setEditing(item); setSheetVisible(true); }
  function closeSheet() { setSheetVisible(false); }

  const sections = useMemo<MonthSection<Measurement>[]>(() =>
    groupByMonth(items, (i) => i.dateISO, monthLabelFromYYYYMM), [items]
  );

  const showEmpty = !loading && items.length === 0;

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

      <VitalsFilters value={filter} onChange={setFilter} testID="measurements-filters" />

      {loading && items.length === 0 ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : showEmpty ? (
        <View style={styles.empty}>
          <CustomText variant="subtitle" color="muted">
            Nenhuma medição cadastrada.
          </CustomText>
          <IconButton iconName="add" label="Adicionar medição" onPress={openCreate} testID="m-empty-add" />
        </View>
      ) : (
        <SectionList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          sections={sections as unknown as SectionListData<Measurement>[]}
          keyExtractor={(m) => m.id}
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
              <MeasurementCard item={item} onEdit={openEdit} onDelete={remove} testID="m-card" />
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
