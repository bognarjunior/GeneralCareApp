import React, { useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { PersonStackParamList } from '@/types/navigation';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Surface from '@/components/Surface';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import { usePeople } from '@/hooks/usePeople';
import { getAgeLabel, getInitials } from '@/utils/formatters/person';
import SquareAction from '@/components/SquareAction';

type RouteP = RouteProp<PersonStackParamList, 'PersonDetail'>;

const AVATAR_SIZE = 96;

const PersonDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteP>();
  const { getPerson } = usePeople();

  const person = getPerson(params.personId);
  const age = useMemo(() => (person?.birthDate ? getAgeLabel(person.birthDate) : null), [person]);
  const initials = useMemo(() => (person ? getInitials(person.fullName) : ''), [person]);

  return (
    <Container>
      <Header
        title="GeneralApp"
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardWrap}>
          <View style={[styles.avatarWrap, { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }]}>
            {person?.avatarUri ? (
              <Image source={{ uri: person.avatarUri }} style={styles.avatarImg} resizeMode="cover" />
            ) : (
              <View style={styles.avatarFallback}>
                <CustomText weight="bold" style={styles.avatarText}>{initials}</CustomText>
              </View>
            )}
          </View>

          <Surface
            gradient
            padding="lg"
            gradientColors={theme.gradients.surface.emphasis}
            style={styles.card}
          >
            <View style={{ paddingTop: AVATAR_SIZE / 2 + theme.spacing.sm }}>
              <CustomText weight="bold" style={styles.name}>
                {person?.fullName ?? '—'}
              </CustomText>

              {!!age && <CustomText style={styles.age}>{age}</CustomText>}

              <CustomText weight="bold" style={styles.sectionTitle}>
                Observações
              </CustomText>

              <CustomText style={styles.obs}>
                {person?.notes?.trim() ? person.notes : 'Não foi informado nenhuma.'}
              </CustomText>
            </View>
          </Surface>
        </View>

        <View style={styles.actions}>
          <SquareAction
            style={styles.actionTile}
            iconName="medical-services"
            label="Medicamentos"
            colors={theme.gradients.buttons.medications}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="monitor-heart"
            label="Pressão Arterial"
            colors={theme.gradients.buttons.bloodPressure}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="bloodtype"
            label="Glicemia"
            colors={theme.gradients.buttons.glycemia}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="view-timeline"
            label="Medidas (Peso / Altura)"
            colors={theme.gradients.buttons.measurements}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="event-note"
            label="Consultas Médicas"
            colors={theme.gradients.buttons.appointments}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="insights"
            label="Gráficos"
            colors={theme.gradients.buttons.charts}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default PersonDetailScreen;
