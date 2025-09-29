import React, { useMemo, useState } from 'react';
import { Platform, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import type { FormDateFieldProps } from '@/types/components/FormDateField';
import { parseDDMMYYYY, formatDDMMYYYY } from '@/utils/date';

const FormDateField: React.FC<FormDateFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder = 'DD/MM/AAAA',
  minDate,
  maxDate,
  disabled,
  style,
  labelStyle,
  testID,
}) => {
  const [show, setShow] = useState(false);

  const selectedDate = useMemo<Date>(() => {
    return parseDDMMYYYY(value) ?? new Date(1990, 0, 1);
  }, [value]);

  const onChange = (evt: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (evt.type === 'dismissed' || !date) return;
    onChangeText(formatDDMMYYYY(date));
  };

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
        onPress={() => !disabled && setShow(true)}
        testID={testID || 'date-field'}
      >
        <CustomText
          variant="body"
          color="text"
          style={styles.value}
          numberOfLines={1}
        >
          {value || placeholder}
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
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={onChange}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="fade" onRequestClose={() => setShow(false)}>
          <Pressable style={styles.backdrop} onPress={() => setShow(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <CustomText variant="subtitle" weight="semibold">Selecionar data</CustomText>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => setShow(false)} style={styles.headerBtn}>
                  <CustomText variant="body" color="muted">Cancelar</CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShow(false)} style={styles.headerBtn}>
                  <CustomText variant="body" color="primary" weight="bold">OK</CustomText>
                </TouchableOpacity>
              </View>
            </View>

            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="inline"
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={onChange}
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
