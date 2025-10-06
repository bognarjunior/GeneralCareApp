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
import Toast from '@/components/Toast';
import FormAvatarField from '@/components/FormAvatarField';
import { isValidDDMMYYYY } from '@/utils/date';

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
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

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
      setToast({ type: 'error', msg: 'Revise os campos destacados.' });
      return;
    }

    try {
      const created = await createPerson({
        ...parsed.data,
        avatarUri: form.avatarUri || undefined,
      });
      setToast({ type: 'success', msg: 'Pessoa cadastrada com sucesso!' });
      navigation.navigate('PersonDetailStack', { personId: created.id });
    } catch (e) {
      console.error('Falha ao criar pessoa:', e);
      setToast({ type: 'error', msg: 'Não foi possível salvar. Tente novamente.' });
    } finally {
      setSubmitting(false);
    }
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
              <Button
                variant="primary"
                label="Salvar"
                gradient
                onPress={handleSubmit}
                disabled={!canSave || submitting}
                testID="btn-save"
              />
              <Button
                variant="danger"
                label="Cancelar"
                gradient
                onPress={() => navigation.goBack()}
                testID="btn-cancel"
              />
            </Button.Group>
          </View>
        </Surface>
      </ScrollView>

      <Toast
        visible={!!toast}
        variant={toast?.type ?? 'success'}
        message={toast?.msg ?? ''}
        onHide={() => setToast(null)}
        position="bottom"
        offset={theme.spacing.xl}
        duration={1200}
      />
    </Container>
  );
};

export default PersonFormScreen;
