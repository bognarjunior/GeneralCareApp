import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface FormDateFieldProps {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  mode?: 'date' | 'datetime';
  error?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}
