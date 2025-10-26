import React from 'react';
import { FlatList, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Container from '@/components/Container';
import Header from '@/components/Header';
import IconButton from '@/components/IconButton';
import CustomText from '@/components/CustomText';
import Surface from '@/components/Surface';
import theme from '@/theme';
import { useMeasurements } from '@/hooks/useMeasurements';
import type { PersonStackParamList } from '@/types/navigation';
import styles from './styles';

type RP = RouteProp<PersonStackParamList, 'Measurements'>;

const MeasurementsScreen: React.FC = () => {
  const { params } = useRoute<RP>();
  const navigation = useNavigation<any>();
  const { items, loading, refresh, remove } = useMeasurements(params.personId);

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
            onPress={() => navigation.navigate('MeasurementsForm', { personId: params.personId })}
            backgroundColor="transparent"
            iconColor={theme.colors.text}
            textColor={theme.colors.text}
          />
        }
      />

      <FlatList
        data={items}
        keyExtractor={(m) => m.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <CustomText variant="subtitle" color="muted" style={styles.emptyText}>
              Nenhuma medição cadastrada.
            </CustomText>
            <IconButton
              iconName="add"
              label="Adicionar medição"
              onPress={() => navigation.navigate('MeasurementsForm', { personId: params.personId })}
            />
          </View>
        }
        renderItem={({ item }) => (
          <Surface padding="md" style={styles.row}>
            <View style={styles.rowLeft}>
              <CustomText weight="bold">{new Date(item.dateISO).toLocaleDateString()}</CustomText>
              <CustomText color="muted">{item.notes?.trim() || '—'}</CustomText>
            </View>
            <View style={styles.rowRight}>
              <CustomText weight="bold">{item.weightKg} kg</CustomText>
              <CustomText color="muted">{item.heightCm} cm • IMC {item.bmi}</CustomText>
              <View style={styles.rowActions}>
                <IconButton
                  iconName="edit"
                  backgroundColor="transparent"
                  iconColor={theme.colors.text}
                  textColor={theme.colors.text}
                  onPress={() =>
                    navigation.navigate('MeasurementsForm', {
                      personId: params.personId,
                      measurementId: item.id,
                      preset: item,
                    })
                  }
                />
                <IconButton
                  iconName="delete"
                  backgroundColor="transparent"
                  iconColor={theme.colors.danger}
                  textColor={theme.colors.danger}
                  onPress={() => remove(item.id)}
                />
              </View>
            </View>
          </Surface>
        )}
      />
    </Container>
  );
};

export default MeasurementsScreen;
