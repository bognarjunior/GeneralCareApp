import React, { useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import ActionSheet from '@/components/ActionSheet';
import theme from '@/theme';
import styles from './styles';
import { useMeasurements } from '@/hooks/useMeasurements';
import type { Measurement } from '@/repositories/measurementsRepository';

export interface MeasurementFormSheetProps {
  visible: boolean;
  onClose: () => void;
  personId: string;
  preset?: Measurement | null;
  onSaved?: () => void;
}

const MeasurementFormSheet: React.FC<MeasurementFormSheetProps> = ({
  visible,
  onClose,
  personId,
  preset,
  onSaved,
}) => {
  const { create, update, calcBMI } = useMeasurements(personId);

  const [dateISO, setDateISO] = useState<string>(preset?.dateISO ?? new Date().toISOString());
  const [weightKg, setWeightKg] = useState<string>(preset?.weightKg?.toString?.() ?? '');
  const [heightCm, setHeightCm] = useState<string>(preset?.heightCm?.toString?.() ?? '');
  const [notes, setNotes] = useState<string>(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const editing = Boolean(preset?.id);

  const bmi = useMemo(() => {
    const w = parseFloat((weightKg || '').replace(',', '.'));
    const h = parseFloat((heightCm || '').replace(',', '.'));
    if (!w || !h) return '—';
    return calcBMI(w, h).toString();
  }, [weightKg, heightCm, calcBMI]);

  async function handleSave() {
    const w = parseFloat((weightKg || '').replace(',', '.'));
    const h = parseFloat((heightCm || '').replace(',', '.'));
    if (!w || !h) return;

    setSaving(true);
    try {
      if (editing && preset?.id) {
        await update(preset.id, {
          dateISO,
          weightKg: w,
          heightCm: h,
          notes: notes?.trim() || undefined,
        });
      } else {
        await create({
          personId,
          dateISO,
          weightKg: w,
          heightCm: h,
          notes: notes?.trim() || undefined,
        });
      }
      onClose();
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    if (visible) {
      setDateISO(preset?.dateISO ?? new Date().toISOString());
      setWeightKg(preset?.weightKg?.toString?.() ?? '');
      setHeightCm(preset?.heightCm?.toString?.() ?? '');
      setNotes(preset?.notes ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, preset?.id]);

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar medição' : 'Nova medição'}
      testID="measurements-sheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={theme.sizes.header ?? 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.group}>
            <FormDateField
              label="Data"
              mode="datetime"
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
              testID="m-weight"
            />

            <FormTextField
              label="Altura (cm)"
              placeholder="Ex.: 175"
              keyboardType="decimal-pad"
              value={heightCm}
              onChangeText={setHeightCm}
              testID="m-height"
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
              testID="m-notes"
            />

            <Button.Group direction="column" gap={theme.spacing.md} style={styles.buttons}>
              <Button
                variant="primary"
                label={editing ? 'Salvar alterações' : 'Salvar'}
                onPress={handleSave}
                disabled={saving}
                gradient
                testID="m-save"
              />
              <Button
                variant="ghost"
                label="Cancelar"
                onPress={onClose}
                disabled={saving}
                testID="m-cancel"
              />
            </Button.Group>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ActionSheet>
  );
};

export default MeasurementFormSheet;
