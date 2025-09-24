import React, { useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';
import theme from '@/theme';
import CustomText from '@/components/CustomText';
import type { FormDateFieldProps } from '@/types/components/FormDateField';
import { formatDDMMYYYY, parseDDMMYYYY } from '@/utils/date';

const FormDateField: React.FC<FormDateFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder = 'DD/MM/AAAA',
  minDate,
  maxDate,
  disabled,
  testID,
  style,
  labelStyle,
  inputStyle,
}) => {
  const [show, setShow] = useState(false);
  const [temp, setTemp] = useState<Date | null>(null);

  const selectedDate = useMemo<Date>(() => {
    const parsed = parseDDMMYYYY(value);
    return parsed ?? new Date(1990, 0, 1);
  }, [value]);

  const openPicker = () => {
    if (disabled) return;
    setTemp(selectedDate);
    setShow(true);
  };

  // ANDROID – modal nativo
  const onAndroidChange = (evt: DateTimePickerEvent, date?: Date) => {
    if (evt.type === 'dismissed') {
      setShow(false);
      return;
    }
    if (date) onChangeText(formatDDMMYYYY(date));
    setShow(false);
  };

  // iOS – modal próprio com OK/Cancelar
  const onIOSChange = (_evt: DateTimePickerEvent, date?: Date) => {
    if (date) setTemp(date);
  };
  const confirmIOS = () => {
    if (temp) onChangeText(formatDDMMYYYY(temp));
    setShow(false);
  };
  const cancelIOS = () => {
    setTemp(null);
    setShow(false);
  };

  const borderStyle = error
    ? { borderColor: theme.colors.danger }
    : { borderColor: theme.colors.border };

  return (
    <View style={[styles.wrapper, style]}>
      {!!label && (
        <CustomText variant="caption" weight="medium" color="muted" style={labelStyle}>
          {label}
        </CustomText>
      )}

      <TouchableOpacity
        testID={testID ?? 'date-field-touchable'}
        activeOpacity={disabled ? 1 : 0.7}
        style={[styles.input, borderStyle, disabled && styles.inputDisabled, inputStyle]}
        onPress={openPicker}
      >
        <CustomText
          variant="body"
          color={value ? 'text' : 'muted'}
          style={styles.value}
          numberOfLines={1}
        >
          {value || placeholder}
        </CustomText>
        <Icon name="calendar-today" size={theme.sizes.icon.md} color={theme.colors.muted} />
      </TouchableOpacity>

      {!!error && (
        <CustomText variant="caption" color="danger" style={styles.error}>
          {error}
        </CustomText>
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={onAndroidChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="fade" onRequestClose={cancelIOS}>
          <Pressable style={styles.backdrop} onPress={cancelIOS} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <CustomText variant="subtitle" weight="semibold">Selecionar data</CustomText>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={cancelIOS} style={styles.headerBtn}>
                  <CustomText variant="body" color="muted">Cancelar</CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIOS} style={styles.headerBtn}>
                  <CustomText variant="body" color="primary" weight="bold">OK</CustomText>
                </TouchableOpacity>
              </View>
            </View>
            <DateTimePicker
              value={temp ?? selectedDate}
              mode="date"
              display="inline"
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={onIOSChange}
              themeVariant="light"
              style={styles.iosPicker}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default FormDateField;
