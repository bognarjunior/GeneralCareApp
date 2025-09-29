import { StyleProp, ViewStyle } from 'react-native';

export interface FormAvatarFieldProps {
  label?: string;
  value?: string;
  onChange: (uri?: string) => void;
  error?: string;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
