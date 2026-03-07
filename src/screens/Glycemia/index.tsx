import React, { useMemo, useState } from 'react';
import { SectionList, View, ActivityIndicator, SectionListData } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Container from '@/components/Container';
import Header from '@/components/Header';
import IconButton from '@/components/IconButton';
import CustomText from '@/components/CustomText';
import VitalsFilters from '@/components/VitalsFilters';
import GlycemiaCard from '@/components/GlycemiaCard';
import ListFooterProgress from '@/components/ListFooterProgress';
import theme from '@/theme';
import styles from './styles';

import { useGlycemia } from '@/hooks/useGlycemia';
import type { GlycemiaRouteProps } from '@/types/navigation';
import type { Glycemia } from '@/repositories/glycemiaRepository';

import { groupByMonth, MonthSection } from '@/utils/list/sectionByMonth';
import { monthLabelFromYYYYMM } from '@/utils/date';
import GlycemiaFormSheet from './components/FormSheet';

const GlycemiaScreen: React.FC = () => {
  const { params } = useRoute<GlycemiaRouteProps>();
  const navigation = useNavigation<any>();

  const {
    items, loading, refresh, remove,
    filter, setFilter, loadMore, hasMore,
  } = useGlycemia(params.personId);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editing, setEditing] = useState<Glycemia | null>(null);

  function openCreate() { setEditing(null); setSheetVisible(true); }
  function openEdit(item: Glycemia) { setEditing(item); setSheetVisible(true); }
  function closeSheet() { setSheetVisible(false); }

  const sections = useMemo<MonthSection<Glycemia>[]>(() =>
    groupByMonth(items, (i) => i.dateISO, monthLabelFromYYYYMM), [items]
  );

  const showEmpty = !loading && items.length === 0;

  return (
    <Container>
      <Header
        title="Glicemia"
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
            testID="gly-open-create"
          />
        }
      />

      <VitalsFilters value={filter} onChange={setFilter} testID="glycemia-filters"  />
        {loading && items.length === 0 ? (
          <View style={styles.loaderArea}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : showEmpty ? (
          <View style={styles.empty}>
            <CustomText variant="subtitle" color="muted" style={styles.emptyText}>
              Nada encontrado neste período.
            </CustomText>
            <IconButton iconName="add" label="Adicionar glicemia" onPress={openCreate} testID="gly-empty-add" />
          </View>
        ) : (
          <SectionList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            sections={sections as unknown as SectionListData<Glycemia>[]}
            keyExtractor={(g) => g.id}
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
                <GlycemiaCard item={item} onEdit={openEdit} onDelete={remove} testID="gly-card" />
              </View>
            )}
          />
        )}

      <GlycemiaFormSheet
        visible={sheetVisible}
        onClose={closeSheet}
        personId={params.personId}
        preset={editing}
        onSaved={refresh}
      />
    </Container>
  );
};

export default GlycemiaScreen;