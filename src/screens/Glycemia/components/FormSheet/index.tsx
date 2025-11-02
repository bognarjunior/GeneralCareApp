import React, { useMemo, useState } from 'react';
import { View, ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ActionSheet from '@/components/ActionSheet';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import CustomText from '@/components/CustomText';
import theme from '@/theme';

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
  const insets = useSafeAreaInsets();

  const editing = Boolean(preset?.id);

  const [dateISO, setDateISO] = useState<string>(preset?.dateISO ?? new Date().toISOString());
  const [value, setValue] = useState<string>(preset?.valueMgDl?.toString?.() ?? '');
  const [context, setContext] = useState<string>(preset?.context ?? 'fasting');
  const [notes, setNotes] = useState<string>(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const numericValue = useMemo(() => parseFloat(value.replace(',', '.')), [value]);
  const isInvalid = !Number.isFinite(numericValue) || numericValue < 0 || numericValue > 2000;

  const contentStyle: StyleProp<ViewStyle> = [
    styles.content,
    {
      paddingBottom: theme.spacing.xl * 2 + Math.max(insets.bottom, 12) + 12,
    },
  ];

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

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar Glicemia' : 'Nova Glicemia'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={contentStyle}
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

          <Button.Group direction="column" gap={theme.spacing.md} style={styles.buttons}>
            <Button
              variant="primary"
              label={editing ? 'Salvar alterações' : 'Salvar'}
              onPress={handleSave}
              disabled={saving || isInvalid}
              gradient
            />
          </Button.Group>

          <View style={{ height: Math.max(insets.bottom, 20) }} />
        </View>
      </ScrollView>
    </ActionSheet>
  );
};

export default GlycemiaFormSheet;
