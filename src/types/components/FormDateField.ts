import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface FormDateFieldProps {
  label?: string;
  value?: string;
  onChangeText: (v: string) => void;
  error?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  testID?: string;

  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}
