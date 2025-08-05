import { TextProps, StyleProp, TextStyle } from 'react-native';
import theme from '@/theme';

export type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption';
export type Weight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
export type Color = keyof typeof theme.colors;

export interface CustomTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  color?: Color;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}
