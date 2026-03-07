import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormSheet from '@/components/FormSheet';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import styles from './styles';
import type { GlycemiaFormSheetProps } from './types';
import { useGlycemia } from '@/hooks/useGlycemia';

const GlycemiaFormSheet: React.FC<GlycemiaFormSheetProps> = ({
  visible,
  onClose,
  personId,
  preset,
  onSaved,
}) => {
  const { create, update } = useGlycemia(personId);

  const editing = Boolean(preset?.id);

  const [dateISO, setDateISO] = useState<string>(preset?.dateISO ?? new Date().toISOString());
  const [value, setValue] = useState<string>(preset?.valueMgDl?.toString?.() ?? '');
  const [context, setContext] = useState<string>(preset?.context ?? 'fasting');
  const [notes, setNotes] = useState<string>(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const numericValue = useMemo(() => parseFloat(value.replace(',', '.')), [value]);
  const isInvalid = !Number.isFinite(numericValue) || numericValue < 0 || numericValue > 2000;

  async function handleSave() {
    if (isInvalid) return;

    setSaving(true);
    try {
      if (editing && preset?.id) {
        await update(preset.id, {
          dateISO,
          valueMgDl: numericValue,
          context: context as any,
          notes: notes?.trim() || undefined,
        });
      } else {
        await create({
          personId,
          dateISO,
          valueMgDl: numericValue,
          context: context as any,
          notes: notes?.trim() || undefined,
        });
      }
      onSaved();
      onClose();
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
      />
      <Button
        variant="ghost"
        label="Cancelar"
        onPress={onClose}
        disabled={saving}
      />
    </Button.Group>
  );

  return (
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar Glicemia' : 'Nova Glicemia'}
      footer={footer}
    >
      <View style={styles.group}>
        <FormDateField
          label="Data e hora"
          value={dateISO}
          onChangeText={setDateISO}
          mode="datetime"
          testID="gly-date"
        />

        <FormTextField
          label="Valor (mg/dL)"
          placeholder="Ex.: 94"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={setValue}
          error={isInvalid ? 'Valor deve estar entre 0 e 2000' : undefined}
          testID="gly-value"
        />

        <View>
          <CustomText variant="caption" color="text" style={styles.label}>
            Contexto
          </CustomText>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={context}
              onValueChange={(v) => setContext(v)}
              testID="gly-context"
            >
              <Picker.Item label="Jejum" value="fasting" />
              <Picker.Item label="Pré-prandial" value="preprandial" />
              <Picker.Item label="Pós-prandial" value="postprandial" />
              <Picker.Item label="Aleatória" value="random" />
              <Picker.Item label="Ao deitar" value="bedtime" />
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
          testID="gly-notes"
        />

      </View>
    </FormSheet>
  );
};

export default GlycemiaFormSheet;
