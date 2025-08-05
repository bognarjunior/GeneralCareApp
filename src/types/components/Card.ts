import { ReactNode } from 'react';
import { ViewStyle, StyleProp } from 'react-native';

export interface CardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  rightIcon?: ReactNode;
}
