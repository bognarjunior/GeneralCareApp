// src/screens/People/Form/index.tsx
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import styles from './styles';
import Container from '@/components/Container';
import CustomText from '@/components/CustomText';
import IconButton from '@/components/IconButton';
import FormTextField from '@/components/FormTextField';
import FormDateField from '@/components/FormDateField';
import theme from '@/theme';
import { usePeople } from '@/hooks/usePeople';
import { personCreateSchema } from '@/utils/validators/person';
import type { PersonCreateSchema } from '@/utils/validators/person';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PersonFormScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { createPerson } = usePeople();

  const [form, setForm] = useState<PersonCreateSchema>({
    fullName: '',
    birthDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonCreateSchema, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    const parsed = personCreateSchema.safeParse({
      ...form,
      birthDate: form.birthDate?.trim() ? form.birthDate : undefined,
      notes: form.notes?.trim() ? form.notes : undefined,
    });
    return parsed.success;
  }, [form]);

  function setField<K extends keyof PersonCreateSchema>(
    key: K,
    value: PersonCreateSchema[K]
  ) {
    setForm(prev => ({ ...prev, [key]: value as any }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
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
      return;
    }

    try {
      const created = await createPerson({
        fullName: parsed.data.fullName,
        birthDate: parsed.data.birthDate,
        notes: parsed.data.notes,
      });
      navigation.navigate('PersonDetailStack', { personId: created.id });
    } catch (e) {
      console.error('Falha ao criar pessoa:', e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomText variant="title" weight="bold" style={styles.header}>
          Cadastrar pessoa
        </CustomText>

        <View style={styles.formGroup}>
          <FormTextField
            label="Nome completo"
            placeholder="Ex.: João da Silva"
            autoCapitalize="words"
            returnKeyType="next"
            value={form.fullName}
            onChangeText={t => setField('fullName', t)}
            error={errors.fullName}
          />

          <FormDateField
            label="Data de nascimento (opcional)"
            value={form.birthDate ?? ''}
            onChangeText={t => setField('birthDate', t)}
            error={errors.birthDate}
          />

          <FormTextField
            label="Observações (opcional)"
            placeholder="Alergias, observações gerais…"
            multiline
            numberOfLines={4}
            value={form.notes ?? ''}
            onChangeText={t => setField('notes', t)}
            error={errors.notes}
            textAlignVertical="top"
          />
        </View>

        <IconButton
          iconName="save"
          label={submitting ? 'Salvando...' : 'Salvar'}
          onPress={handleSubmit}
          backgroundColor={isValid ? theme.colors.primary : theme.colors.disabled}
          iconColor={theme.colors.white}
          textColor={theme.colors.white}
        />
      </ScrollView>
    </Container>
  );
};

export default PersonFormScreen;
