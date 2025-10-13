import React, { useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { PersonStackParamList } from '@/types/navigation';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Surface from '@/components/Surface';
import CustomText from '@/components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import theme from '@/theme';
import { usePeople } from '@/hooks/usePeople';
import { getAgeLabel, getInitials } from '@/utils/formatters/person';

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

              {!!age && (
                <CustomText style={styles.age}>
                  {age}
                </CustomText>
              )}

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
          <View style={styles.actionBtn}>
            <Icon name="medical-services" size={20} color={theme.colors.white} />
            <CustomText weight="medium" style={styles.actionLabel}>Medicamentos</CustomText>
          </View>
          <View style={styles.actionBtn}>
            <Icon name="monitor-heart" size={20} color={theme.colors.white} />
            <CustomText weight="medium" style={styles.actionLabel}>Pressão Arterial</CustomText>
          </View>
          <View style={styles.actionBtn}>
            <Icon name="bloodtype" size={20} color={theme.colors.white} />
            <CustomText weight="medium" style={styles.actionLabel}>Glicemia</CustomText>
          </View>
          <View style={styles.actionBtn}>
            <Icon name="view-timeline" size={20} color={theme.colors.white} />
            <CustomText weight="medium" style={styles.actionLabel}>Medidas (Peso / Altura)</CustomText>
          </View>
          <View style={styles.actionBtn}>
            <Icon name="event-note" size={20} color={theme.colors.white} />
            <CustomText weight="medium" style={styles.actionLabel}>Consultas Médicas</CustomText>
          </View>
          <View style={styles.actionBtn}>
            <Icon name="insights" size={20} color={theme.colors.white} />
            <CustomText weight="medium" style={styles.actionLabel}>Gráficos</CustomText>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default PersonDetailScreen;
