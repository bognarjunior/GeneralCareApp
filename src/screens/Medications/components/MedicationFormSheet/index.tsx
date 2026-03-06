import React, { useEffect, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FormSheet from '@/components/FormSheet';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';
import { useMedications } from '@/hooks/useMedications';
import { formatDDMMYYYY } from '@/utils/date';
import type { Medication } from '@/repositories/medicationsRepository';

function todayDDMMYYYY() {
  return formatDDMMYYYY(new Date());
}

export interface MedicationFormSheetProps {
  visible: boolean;
  onClose: () => void;
  personId: string;
  preset?: Medication | null;
  onSaved?: () => void;
}

const MedicationFormSheet: React.FC<MedicationFormSheetProps> = ({
  visible,
  onClose,
  personId,
  preset,
  onSaved,
}) => {
  const { create, update } = useMedications(personId);
  const editing = Boolean(preset?.id);

  const [name, setName] = useState(preset?.name ?? '');
  const [dosage, setDosage] = useState(preset?.dosage ?? '');
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(preset?.scheduleTimes ?? []);
  const [timeInput, setTimeInput] = useState('');
  const [startDate, setStartDate] = useState(preset?.startDate ?? todayDDMMYYYY());
  const [endDate, setEndDate] = useState(preset?.endDate ?? '');
  const [notes, setNotes] = useState(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(preset?.name ?? '');
      setDosage(preset?.dosage ?? '');
      setScheduleTimes(preset?.scheduleTimes ?? []);
      setTimeInput('');
      setStartDate(preset?.startDate ?? todayDDMMYYYY());
      setEndDate(preset?.endDate ?? '');
      setNotes(preset?.notes ?? '');
    }
  }, [visible, preset?.id]);

  const isNameValid = name.trim().length >= 2;
  const isTimeInputValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(timeInput);

  function handleTimeInput(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      setTimeInput(digits);
    } else {
      setTimeInput(`${digits.slice(0, 2)}:${digits.slice(2)}`);
    }
  }

  function addTime() {
    const t = timeInput.trim();
    if (!isTimeInputValid || scheduleTimes.includes(t)) return;
    setScheduleTimes((prev) => [...prev, t].sort());
    setTimeInput('');
  }

  function removeTime(t: string) {
    setScheduleTimes((prev) => prev.filter((x) => x !== t));
  }

  async function handleSave() {
    if (!isNameValid) return;
    setSaving(true);
    try {
      const payload = {
        personId,
        name: name.trim(),
        dosage: dosage.trim() || undefined,
        scheduleTimes,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes: notes.trim() || undefined,
        isActive: preset?.isActive ?? true,
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

  return (
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar medicamento' : 'Novo medicamento'}
      testID="med-sheet"
    >
      <View style={styles.group}>
        <FormTextField
          label="Nome do medicamento"
          placeholder="Ex.: Losartana"
          value={name}
          onChangeText={setName}
          error={name.trim().length > 0 && !isNameValid ? 'Mínimo 2 caracteres' : undefined}
          testID="med-name"
        />

        <FormTextField
          label="Dosagem"
          placeholder="Ex.: 50mg, 1 comprimido"
          value={dosage}
          onChangeText={setDosage}
          testID="med-dosage"
        />

        <View>
          <CustomText variant="caption" color="text" style={styles.label}>
            Horários de tomada
          </CustomText>

          <View style={styles.timeInputRow}>
            <TextInput
              style={styles.timeInput}
              placeholder="HH:mm"
              placeholderTextColor={theme.colors.muted}
              value={timeInput}
              onChangeText={handleTimeInput}
              keyboardType="numeric"
              maxLength={5}
              testID="med-time-input"
            />
            <Pressable
              style={[styles.addTimeBtn, !isTimeInputValid && styles.addTimeBtnDisabled]}
              onPress={addTime}
              disabled={!isTimeInputValid}
              testID="med-time-add"
            >
              <Icon name="add" size={20} color={isTimeInputValid ? theme.colors.white : theme.colors.muted} />
            </Pressable>
          </View>

          {scheduleTimes.length > 0 && (
            <View style={styles.chipList}>
              {scheduleTimes.map((t) => (
                <View key={t} style={styles.chip}>
                  <CustomText variant="caption" style={styles.chipText}>{t}</CustomText>
                  <Pressable onPress={() => removeTime(t)} testID={`med-time-remove-${t}`}>
                    <Icon name="close" size={14} color={theme.colors.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <FormDateField
          label="Data de início"
          value={startDate}
          onChangeText={setStartDate}
          testID="med-start"
        />

        <FormDateField
          label="Data de término (opcional)"
          value={endDate}
          onChangeText={setEndDate}
          testID="med-end"
        />

        <FormTextField
          label="Observações"
          placeholder="Opcional"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
          testID="med-notes"
        />

        <Button.Group direction="column" gap={theme.spacing.md} style={styles.buttons}>
          <Button
            variant="primary"
            label={editing ? 'Salvar alterações' : 'Salvar'}
            onPress={handleSave}
            disabled={saving || !isNameValid}
            gradient
            testID="med-save"
          />
          <Button
            variant="ghost"
            label="Cancelar"
            onPress={onClose}
            disabled={saving}
            testID="med-cancel"
          />
        </Button.Group>
      </View>
    </FormSheet>
  );
};

export default MedicationFormSheet;
