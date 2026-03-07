import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormSheet from '@/components/FormSheet';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import styles from './styles';
import { useBloodPressure } from '@/hooks/useBloodPressure';
import type { BloodPressure, BloodPressureArm } from '@/repositories/bloodPressureRepository';

export interface BloodPressureFormSheetProps {
  visible: boolean;
  onClose: () => void;
  personId: string;
  preset?: BloodPressure | null;
  onSaved?: () => void;
}

const BloodPressureFormSheet: React.FC<BloodPressureFormSheetProps> = ({
  visible,
  onClose,
  personId,
  preset,
  onSaved,
}) => {
  const { create, update } = useBloodPressure(personId);

  const [dateISO, setDateISO] = useState<string>(preset?.dateISO ?? new Date().toISOString());
  const [systolic, setSystolic] = useState<string>(preset?.systolic?.toString() ?? '');
  const [diastolic, setDiastolic] = useState<string>(preset?.diastolic?.toString() ?? '');
  const [pulse, setPulse] = useState<string>(preset?.pulse?.toString() ?? '');
  const [arm, setArm] = useState<string>(preset?.arm ?? '');
  const [notes, setNotes] = useState<string>(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const editing = Boolean(preset?.id);

  const systolicNum = parseFloat(systolic.replace(',', '.'));
  const diastolicNum = parseFloat(diastolic.replace(',', '.'));
  const pulseNum = pulse.trim() ? parseFloat(pulse.replace(',', '.')) : undefined;

  const isInvalid =
    !Number.isFinite(systolicNum) || systolicNum <= 0 || systolicNum > 300 ||
    !Number.isFinite(diastolicNum) || diastolicNum <= 0 || diastolicNum > 200;

  useEffect(() => {
    if (visible) {
      setDateISO(preset?.dateISO ?? new Date().toISOString());
      setSystolic(preset?.systolic?.toString() ?? '');
      setDiastolic(preset?.diastolic?.toString() ?? '');
      setPulse(preset?.pulse?.toString() ?? '');
      setArm(preset?.arm ?? '');
      setNotes(preset?.notes ?? '');
    }
  }, [visible, preset?.id]);

  async function handleSave() {
    if (isInvalid) return;

    setSaving(true);
    try {
      const payload = {
        dateISO,
        systolic: systolicNum,
        diastolic: diastolicNum,
        pulse: pulseNum,
        arm: arm ? (arm as BloodPressureArm) : undefined,
        notes: notes.trim() || undefined,
      };

      if (editing && preset?.id) {
        await update(preset.id, payload);
      } else {
        await create({ personId, ...payload });
      }

      onClose();
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <Button.Group direction="column">
      <Button
        variant="primary"
        label={editing ? 'Salvar alterações' : 'Salvar'}
        onPress={handleSave}
        disabled={saving || isInvalid}
        gradient
        testID="bp-save"
      />
      <Button
        variant="ghost"
        label="Cancelar"
        onPress={onClose}
        disabled={saving}
        testID="bp-cancel"
      />
    </Button.Group>
  );

  return (
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar pressão arterial' : 'Nova pressão arterial'}
      testID="bp-sheet"
      footer={footer}
    >
      <View style={styles.group}>
        <FormDateField
          label="Data e hora"
          mode="datetime"
          value={dateISO}
          onChangeText={setDateISO}
          testID="bp-date"
        />

        <FormTextField
          label="Sistólica (mmHg)"
          placeholder="Ex.: 120"
          keyboardType="number-pad"
          value={systolic}
          onChangeText={setSystolic}
          error={
            systolic.trim() && (!Number.isFinite(systolicNum) || systolicNum <= 0 || systolicNum > 300)
              ? 'Valor deve estar entre 1 e 300'
              : undefined
          }
          testID="bp-systolic"
        />

        <FormTextField
          label="Diastólica (mmHg)"
          placeholder="Ex.: 80"
          keyboardType="number-pad"
          value={diastolic}
          onChangeText={setDiastolic}
          error={
            diastolic.trim() && (!Number.isFinite(diastolicNum) || diastolicNum <= 0 || diastolicNum > 200)
              ? 'Valor deve estar entre 1 e 200'
              : undefined
          }
          testID="bp-diastolic"
        />

        <FormTextField
          label="Pulso (bpm)"
          placeholder="Opcional"
          keyboardType="number-pad"
          value={pulse}
          onChangeText={setPulse}
          testID="bp-pulse"
        />

        <View>
          <CustomText variant="caption" color="text" style={styles.label}>
            Braço
          </CustomText>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={arm}
              onValueChange={(v) => setArm(v)}
              testID="bp-arm"
            >
              <Picker.Item label="Não informado" value="" />
              <Picker.Item label="Braço esquerdo" value="left" />
              <Picker.Item label="Braço direito" value="right" />
            </Picker>
          </View>
        </View>

        <FormTextField
          label="Observações"
          placeholder="Opcional"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
          testID="bp-notes"
        />

      </View>
    </FormSheet>
  );
};

export default BloodPressureFormSheet;
