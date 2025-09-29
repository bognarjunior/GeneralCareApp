import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface SurfaceProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  gradient?: boolean;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  padding?: 'sm' | 'md' | 'lg' | 'xl' | number;
}
