import { StyleProp, ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | `${number}%` | 'auto';
  height?: number;
  borderRadius?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
