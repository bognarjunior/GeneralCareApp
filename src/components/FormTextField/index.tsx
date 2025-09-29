import React, { useMemo } from 'react';
import { View, TextInput, Platform } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import type { FormTextFieldProps } from '@/types/components/FormTextField';

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  containerStyle,
  multiline,
  numberOfLines,
  ...inputProps
}) => {
  const isMultiline = !!(multiline || (numberOfLines && numberOfLines > 1));
  const rows = numberOfLines ?? (isMultiline ? 5 : 1);

  const multiMinHeight = useMemo(() => {
    if (!isMultiline) return undefined;
    const line = theme.fonts.size.md * 1.5;
    return Math.max(theme.spacing.xl, Math.round(line * rows + theme.spacing.md * 2));
  }, [isMultiline, rows]);

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <CustomText variant="caption" color="text" style={styles.label}>
          {label}
        </CustomText>
      )}

      <View
        style={[
          styles.field,
          isMultiline && {
            height: undefined,
            minHeight: multiMinHeight,
            alignItems: 'stretch',
            paddingVertical: theme.spacing.sm,
          },
          !!error && styles.fieldError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.input,
            isMultiline && styles.inputMultiline,
            Platform.OS === 'android' && !isMultiline ? styles.inputSingleAndroid : null,
          ]}
          placeholderTextColor={styles.placeholderColor.color}
          multiline={isMultiline}
          numberOfLines={rows}
          {...inputProps}
        />
      </View>

      {!!error && (
        <CustomText variant="caption" color="danger" style={styles.error}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

export default FormTextField;
