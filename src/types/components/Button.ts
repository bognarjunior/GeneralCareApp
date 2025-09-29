import { StyleProp, TextStyle, ViewStyle, TouchableOpacityProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  gap?: number | SpacingToken;
  direction?: 'row' | 'column';
  equal?: boolean;
  style?: StyleProp<ViewStyle>;
}
