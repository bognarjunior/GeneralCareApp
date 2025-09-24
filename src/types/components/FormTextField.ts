import { StyleProp, TextInputProps, ViewStyle } from 'react-native';

export interface FormTextFieldProps
  extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
