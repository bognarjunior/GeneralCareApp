import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormSheet from '@/components/FormSheet';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';
import { useMedicationIntakes } from '@/hooks/useMedicationIntakes';
import type { Medication } from '@/repositories/medicationsRepository';
import type { MedicationIntake } from '@/repositories/medicationIntakesRepository';

export interface IntakeFormSheetProps {
  visible: boolean;
  onClose: () => void;
  personId: string;
  medication: Medication | null;
  preset?: MedicationIntake | null;
  onSaved?: () => void;
}

const IntakeFormSheet: React.FC<IntakeFormSheetProps> = ({
  visible,
  onClose,
  personId,
  medication,
  preset,
  onSaved,
}) => {
  const { create, update } = useMedicationIntakes(personId);
  const editing = Boolean(preset?.id);

  const [dateISO, setDateISO] = useState(preset?.dateISO ?? new Date().toISOString());
  const [scheduledTime, setScheduledTime] = useState(preset?.scheduledTime ?? '');
  const [notes, setNotes] = useState(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setDateISO(preset?.dateISO ?? new Date().toISOString());
      setScheduledTime(preset?.scheduledTime ?? medication?.scheduleTimes?.[0] ?? '');
      setNotes(preset?.notes ?? '');
    }
  }, [visible, preset?.id, medication?.id]);

  async function handleSave() {
    if (!medication) return;
    setSaving(true);
    try {
      const payload = {
        personId,
        medicationId: medication.id,
        medicationName: medication.name,
        dateISO,
        scheduledTime: scheduledTime || undefined,
        notes: notes.trim() || undefined,
      };

      if (editing && preset?.id) {
        await update(preset.id, payload);
      } else {
        await create(payload);
      }

      onClose();
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  const hasTimes = (medication?.scheduleTimes?.length ?? 0) > 0;

  return (
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar tomada' : 'Registrar tomada'}
      testID="intake-sheet"
    >
      <View style={styles.group}>
        {medication && (
          <View style={styles.medicationInfo}>
            <CustomText variant="caption" color="muted">Medicamento</CustomText>
            <CustomText weight="bold">{medication.name}</CustomText>
            {medication.dosage ? (
              <CustomText variant="caption" color="muted">{medication.dosage}</CustomText>
            ) : null}
          </View>
        )}

        <FormDateField
          label="Data e hora da tomada"
          mode="datetime"
          value={dateISO}
          onChangeText={setDateISO}
          testID="intake-date"
        />

        {hasTimes && (
          <View>
            <CustomText variant="caption" color="text" style={styles.label}>
              Horário planejado
            </CustomText>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={scheduledTime}
                onValueChange={(v) => setScheduledTime(v)}
                testID="intake-scheduled-time"
              >
                <Picker.Item label="Não especificado" value="" />
                {medication?.scheduleTimes.map((t) => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <FormTextField
          label="Observações"
          placeholder="Opcional"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
          testID="intake-notes"
        />

        <Button.Group direction="column" gap={theme.spacing.md} style={styles.buttons}>
          <Button
            variant="primary"
            label={editing ? 'Salvar alterações' : 'Registrar'}
            onPress={handleSave}
            disabled={saving || !medication}
            gradient
            testID="intake-save"
          />
          <Button
            variant="ghost"
            label="Cancelar"
            onPress={onClose}
            disabled={saving}
            testID="intake-cancel"
          />
        </Button.Group>
      </View>
    </FormSheet>
  );
};

export default IntakeFormSheet;
