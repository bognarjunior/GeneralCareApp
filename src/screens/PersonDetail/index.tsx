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
import ActionSheet from '@/components/ActionSheet';
import { PERSON_ACTIONS } from '@/constants/personActions';

type RouteP = RouteProp<PersonStackParamList, 'PersonDetail'>;

const AVATAR_SIZE = 96;

const PersonDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteP>();
  const { getPerson, removePerson } = usePeople();

  const person = getPerson(params.personId);
  const age = useMemo(() => (person?.birthDate ? getAgeLabel(person.birthDate) : null), [person]);
  const initials = useMemo(() => (person ? getInitials(person.fullName) : ''), [person]);

  const [sheetOpen, setSheetOpen] = useState(false);

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
      navigation.popToTop();
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
          <IconButton
            iconName="settings"
            onPress={() => setSheetOpen(true)}
            backgroundColor="transparent"
            iconColor={theme.colors.text}
            textColor={theme.colors.text}
            iconSize={22}
          />
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
          {PERSON_ACTIONS.map((a) => (
            <SquareAction
              key={a.key}
              style={styles.actionTile}
              iconName={a.iconName}
              label={a.label}
              colors={theme.gradients.buttons[a.gradientKey]}
              onPress={() => navigation.navigate(a.route, { personId: params.personId })}
            />
          ))}
        </View>
      </ScrollView>

      <ActionSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        actions={[
          { label: 'Editar', iconName: 'edit', onPress: handleEdit },
          { label: 'Excluir', iconName: 'delete', tint: 'danger', onPress: handleAskDelete },
        ]}
      />

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
