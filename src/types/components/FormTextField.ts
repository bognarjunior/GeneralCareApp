import { StyleProp, TextInputProps, ViewStyle, TextStyle } from 'react-native';

export interface FormTextFieldProps
  extends Omit<TextInputProps, 'style' | 'onChangeText' | 'value'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
