import React, { useMemo, useState } from 'react';
import { Platform, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import type { FormDateFieldProps } from '@/types/components/FormDateField';
import { parseDDMMYYYY, formatDDMMYYYY, formatISOToDDMMYYYY_HHmm, toISO } from '@/utils/date';

const FormDateField: React.FC<FormDateFieldProps> = ({
  label,
  value,
  onChangeText,
  mode = 'date',
  error,
  placeholder,
  minDate,
  maxDate,
  disabled,
  style,
  labelStyle,
  testID,
}) => {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<'date' | 'time'>('date');
  const selectedDate = useMemo<Date>(() => {
    if (mode === 'date') {
      return parseDDMMYYYY(value) ?? new Date(1990, 0, 1);
    }
    const d = value ? new Date(value) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value, mode]);

  const resolvedPlaceholder =
    placeholder ?? (mode === 'date' ? 'DD/MM/AAAA' : 'DD/MM/AAAA HH:mm');

  const displayText =
    value
      ? (mode === 'date' ? value : formatISOToDDMMYYYY_HHmm(value))
      : resolvedPlaceholder;

  function open() {
    if (disabled) return;
    setStage('date');
    setShow(true);
  }

  const onChangeDate = (evt: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android' && evt.type === 'dismissed') {
      setShow(false);
      return;
    }
    if (!date) return;

    if (mode === 'date') {
      onChangeText(formatDDMMYYYY(date));
      if (Platform.OS === 'android') setShow(false);
      return;
    }

    const next = new Date(selectedDate);
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    next.setSeconds(0, 0);
    onChangeText(toISO(next));
    if (Platform.OS === 'android') setStage('time');
  };

  const onChangeTime = (evt: DateTimePickerEvent, time?: Date) => {
    if (Platform.OS === 'android' && evt.type === 'dismissed') {
      setShow(false);
      return;
    }
    if (!time) return;

    const next = new Date(selectedDate);
    next.setHours(time.getHours(), time.getMinutes(), 0, 0);
    onChangeText(toISO(next));
    if (Platform.OS === 'android') setShow(false);
  };

  const renderPickers = () => (
    <>
      {(stage === 'date' || Platform.OS === 'ios') && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={onChangeDate}
          themeVariant="light"
          style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
        />
      )}

      {mode === 'datetime' && (stage === 'time' || Platform.OS === 'ios') && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeTime}
        />
      )}
    </>
  );

  return (
    <View style={[styles.wrapper, style]}>
      {!!label && (
        <CustomText variant="caption" color="text" style={[styles.label, labelStyle]}>
          {label}
        </CustomText>
      )}

      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.7}
        style={[styles.input, disabled && styles.inputDisabled, !!error && styles.inputError]}
        onPress={open}
        testID={testID || (mode === 'date' ? 'date-field' : 'datetime-field')}
      >
        <CustomText variant="body" color="text" style={styles.value} numberOfLines={1}>
          {displayText}
        </CustomText>

        <View style={styles.iconBox}>
          <Icon name="calendar-today" size={20} color={theme.colors.text} />
        </View>
      </TouchableOpacity>

      {!!error && (
        <CustomText variant="caption" color="danger" style={styles.error}>
          {error}
        </CustomText>
      )}

      {show && Platform.OS === 'android' && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setShow(false)}>
          <Pressable style={styles.backdrop} onPress={() => setShow(false)} />
          <View style={styles.sheet}>{renderPickers()}</View>
        </Modal>
      )}

      {show && Platform.OS === 'ios' && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setShow(false)}>
          <Pressable style={styles.backdrop} onPress={() => setShow(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <CustomText variant="subtitle" weight="semibold">
                {mode === 'date' ? 'Selecionar data' : 'Selecionar data e hora'}
              </CustomText>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => setShow(false)} style={styles.headerBtn}>
                  <CustomText variant="body" color="muted">Fechar</CustomText>
                </TouchableOpacity>
              </View>
            </View>
            {renderPickers()}
          </View>
        </Modal>
      )}
    </View>
  );
};

export default FormDateField;
