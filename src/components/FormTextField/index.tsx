import React from 'react';
import { View, TextInput } from 'react-native';
import styles from './styles';
import type { FormTextFieldProps } from '@/types/components/FormTextField';
import CustomText from '@/components/CustomText';
import theme from '@/theme';

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  containerStyle,
  placeholderTextColor = theme.colors.muted,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <CustomText variant="caption" color="muted" style={styles.label}>
        {label}
      </CustomText>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
      {!!error && (
        <CustomText variant="caption" color="danger" style={styles.error}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

export default FormTextField;
