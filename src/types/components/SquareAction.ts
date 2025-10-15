import type { StyleProp, ViewStyle } from 'react-native';

export interface SquareActionProps {
  colors: string[];
  iconName: string;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  contentTestID?: string;
}
