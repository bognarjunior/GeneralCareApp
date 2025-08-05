import { ReactNode } from 'react';
import { ViewStyle, StyleProp } from 'react-native';

export interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
