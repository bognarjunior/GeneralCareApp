import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Surface from '@/components/Surface';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';
import { useMeasurements } from '@/hooks/useMeasurements';
import type { PersonStackParamList } from '@/types/navigation';

type RP = RouteProp<PersonStackParamList, 'Measurements'>; 
type RPF =
  | RouteProp<any, 'MeasurementsForm'>
  | RP;

const MeasurementsFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RPF>() as any;
  const personId: string = route.params?.personId;
  const preset = route.params?.preset;

  const { create, update, calcBMI } = useMeasurements(personId);

  const [dateISO, setDateISO] = useState<string>(preset?.dateISO ?? new Date().toISOString());
  const [weightKg, setWeightKg] = useState<string>(preset?.weightKg?.toString?.() ?? '');
  const [heightCm, setHeightCm] = useState<string>(preset?.heightCm?.toString?.() ?? '');
  const [notes, setNotes] = useState<string>(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const bmi = useMemo(() => {
    const w = parseFloat(weightKg.replace(',', '.'));
    const h = parseFloat(heightCm.replace(',', '.'));
    if (!w || !h) return '—';
    return calcBMI(w, h).toString();
  }, [weightKg, heightCm, calcBMI]);

  const editing = Boolean(preset?.id);

  async function handleSave() {
    const w = parseFloat(weightKg.replace(',', '.'));
    const h = parseFloat(heightCm.replace(',', '.'));
    if (!w || !h) return;

    setSaving(true);
    try {
      if (editing) {
        await update(preset.id, { dateISO, weightKg: w, heightCm: h, notes: notes?.trim() || undefined });
      } else {
        await create({ personId, dateISO, weightKg: w, heightCm: h, notes: notes?.trim() || undefined });
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container>
      <Header
        title={editing ? 'Editar Medição' : 'Nova Medição'}
        titleVariant="title"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Surface padding="lg" style={styles.surface}>
          <View style={styles.group}>
            <FormDateField
              label="Data"
              value={dateISO}
              onChangeText={setDateISO}
              testID="m-date"
            />

            <FormTextField
              label="Peso (kg)"
              placeholder="Ex.: 72.4"
              keyboardType="decimal-pad"
              value={weightKg}
              onChangeText={setWeightKg}
            />

            <FormTextField
              label="Altura (cm)"
              placeholder="Ex.: 175"
              keyboardType="decimal-pad"
              value={heightCm}
              onChangeText={setHeightCm}
            />

            <CustomText color="muted">IMC estimado: {bmi}</CustomText>

            <FormTextField
              label="Observações"
              placeholder="Opcional"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />

            <Button.Group direction="column" gap={theme.spacing.md} style={styles.buttons}>
              <Button
                variant="primary"
                label={editing ? 'Salvar alterações' : 'Salvar'}
                onPress={handleSave}
                disabled={saving}
                gradient
              />
            </Button.Group>
          </View>
        </Surface>
      </ScrollView>
    </Container>
  );
};

export default MeasurementsFormScreen;
