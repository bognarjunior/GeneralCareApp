import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Container from '@/components/Container';
import CustomText from '@/components/CustomText';
import FormTextField from '@/components/FormTextField';
import FormDateField from '@/components/FormDateField';
import Button from '@/components/Button';
import Surface from '@/components/Surface';
import styles from './styles';
import theme from '@/theme';
import { usePeople } from '@/hooks/usePeople';
import { personCreateSchema } from '@/utils/validators/person';
import type { PersonCreateSchema } from '@/utils/validators/person';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import FormAvatarField from '@/components/FormAvatarField';
import { isValidDDMMYYYY } from '@/utils/date';
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FormState = PersonCreateSchema & { avatarUri?: string };

const PersonFormScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { createPerson } = usePeople();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    birthDate: undefined,
    notes: undefined,
    avatarUri: undefined,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonCreateSchema, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setModalState] = useState<{
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({});

  const canSave = useMemo(() => {
    if (form.fullName.trim().length < 2) return false;
    if (form.birthDate && !isValidDDMMYYYY(form.birthDate)) return false;
    return true;
  }, [form]);

  function setField<K extends keyof PersonCreateSchema>(key: K, value: PersonCreateSchema[K]): void;
  function setField(key: 'avatarUri', value: string | undefined): void;
  function setField(key: any, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));

    if (key === 'fullName' || key === 'birthDate' || key === 'notes') {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }

  function openModal(cfg: typeof modalState) {
    setModalState(cfg);
    setModalVisible(true);
  }
  function closeModal() {
    setModalVisible(false);
    setModalState({});
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrors({});

    const parsed = personCreateSchema.safeParse({
      ...form,
      birthDate: form.birthDate?.trim() ? form.birthDate : undefined,
      notes: form.notes?.trim() ? form.notes : undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof PersonCreateSchema, string>> = {};
      parsed.error.issues.forEach(issue => {
        const k = issue.path[0] as keyof PersonCreateSchema;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      });
      setErrors(fieldErrors);
      setSubmitting(false);

      openModal({
        title: 'Campos inválidos',
        message: 'Revise os campos destacados.',
        confirmLabel: 'OK',
        onConfirm: () => closeModal(),
      });
      return;
    }

    try {
      const created = await createPerson({
        ...parsed.data,
        avatarUri: form.avatarUri || undefined,
      });

      openModal({
        title: 'Sucesso',
        message: 'Pessoa cadastrada com sucesso!',
        confirmLabel: 'Ver detalhes',
        onConfirm: () => {
          closeModal();
          navigation.navigate('PersonDetailStack', { personId: created.id });
        },
      });
    } catch (e) {
      console.error('Falha ao criar pessoa:', e);
      openModal({
        title: 'Erro',
        message: 'Não foi possível salvar. Tente novamente.',
        confirmLabel: 'OK',
        onConfirm: () => closeModal(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    openModal({
      title: 'Cancelar cadastro?',
      message: 'Deseja realmente cancelar e voltar?',
      cancelLabel: 'Não',
      confirmLabel: 'Sim',
      onCancel: () => closeModal(),
      onConfirm: () => {
        closeModal();
        navigation.goBack();
      },
    });
  }

  return (
    <Container>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing.xl },
        ]}
      >
        <CustomText variant="title" weight="bold" style={styles.title}>
          Nova pessoa
        </CustomText>

        <CustomText variant="subtitle" color="textSecondary" style={styles.subtitle}>
          Preencha suas informações para começar a usar o app.
        </CustomText>

        <Surface gradient padding="lg" style={styles.surface}>
          <View style={styles.formGroup}>
            <FormAvatarField
              value={form.avatarUri}
              onChange={uri => setField('avatarUri', uri)}
            />

            <FormTextField
              label="Nome *"
              placeholder="Ex.: João da Silva"
              autoCapitalize="words"
              returnKeyType="next"
              value={form.fullName}
              onChangeText={t => setField('fullName', t)}
              error={errors.fullName}
            />

            <FormDateField
              label="Data de nascimento"
              value={form.birthDate ?? ''}
              onChangeText={t => setField('birthDate', t)}
              error={errors.birthDate}
              testID="birthdate"
            />

            <FormTextField
              label="Observações"
              placeholder="Alergias, observações gerais..."
              multiline
              numberOfLines={5}
              value={form.notes ?? ''}
              onChangeText={t => setField('notes', t)}
              error={errors.notes}
              textAlignVertical="top"
              inputStyle={styles.notesInput}
            />

            <Button.Group direction="column" gap={theme.spacing.md} style={styles.buttons}>
              {submitting ? (
                <Skeleton height={theme.spacing.xl} style={styles.skeletonButton} testID="save-skeleton" />
              ) : (
                <Button
                  variant="primary"
                  label="Salvar"
                  gradient
                  onPress={handleSubmit}
                  disabled={!canSave}
                  testID="btn-save"
                />
              )}
              <Button
                variant="danger"
                label="Cancelar"
                gradient
                onPress={handleCancel}
                testID="btn-cancel"
              />
            </Button.Group>
          </View>
        </Surface>
      </ScrollView>

      <Modal
        visible={modalVisible}
        title={modalState.title}
        message={modalState.message}
        confirmLabel={modalState.confirmLabel}
        cancelLabel={modalState.cancelLabel}
        destructive={modalState.destructive}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        testID="confirm-modal"
      />
    </Container>
  );
};

export default PersonFormScreen;
