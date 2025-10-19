import React, { useMemo, useState } from 'react';
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
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';

type RouteP = RouteProp<PersonStackParamList, 'PersonDetail'>;

const AVATAR_SIZE = 96;

const PersonDetailScreen: React.FC = () => {
  // navegação sem casts "never"
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteP>();
  const { getPerson, removePerson } = usePeople();

  const person = getPerson(params.personId);
  const age = useMemo(() => (person?.birthDate ? getAgeLabel(person.birthDate) : null), [person]);
  const initials = useMemo(() => (person ? getInitials(person.fullName) : ''), [person]);

  // estado do modal de exclusão
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (!person) return;
    navigation.navigate('PeopleRegister', { personId: person.id });
  };

  const handleAskDelete = () => {
    if (!person) return;
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!person) return;
    try {
      setDeleting(true);
      await removePerson(person.id);
      navigation.navigate('PeopleList');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Container>
      <Header
        title="GeneralApp"
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
        rightContent={
          <>
            <IconButton
              iconName="edit"
              onPress={handleEdit}
              backgroundColor="transparent"
              iconColor={theme.colors.text}
              textColor={theme.colors.text}
              iconSize={20}
            />
            <IconButton
              iconName="delete"
              onPress={handleAskDelete}
              backgroundColor="transparent"
              iconColor={theme.colors.danger}
              textColor={theme.colors.danger}
              iconSize={20}
            />
          </>
        }
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
            onPress={() => navigation.navigate('Medications', { personId: params.personId })}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="monitor-heart"
            label="Pressão Arterial"
            colors={theme.gradients.buttons.bloodPressure}
            onPress={() => navigation.navigate('BloodPressure', { personId: params.personId })}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="bloodtype"
            label="Glicemia"
            colors={theme.gradients.buttons.glycemia}
            onPress={() => navigation.navigate('Glycemia', { personId: params.personId })}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="view-timeline"
            label="Medidas (Peso / Altura)"
            colors={theme.gradients.buttons.measurements}
            onPress={() => navigation.navigate('Measurements', { personId: params.personId })}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="event-note"
            label="Consultas Médicas"
            colors={theme.gradients.buttons.appointments}
            onPress={() => navigation.navigate('Appointments', { personId: params.personId })}
          />
          <SquareAction
            style={styles.actionTile}
            iconName="insights"
            label="Gráficos"
            colors={theme.gradients.buttons.charts}
            onPress={() => navigation.navigate('Charts', { personId: params.personId })}
          />
        </View>
      </ScrollView>
      <Modal
        visible={confirmOpen}
        title="Excluir pessoa"
        message={`Deseja realmente excluir "${person?.fullName ?? ''}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
        testID="person-delete-modal"
      />
    </Container>
  );
};

export default PersonDetailScreen;
