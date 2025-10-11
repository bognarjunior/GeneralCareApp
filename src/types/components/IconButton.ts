import type { GestureResponderEvent } from 'react-native';

export interface IconButtonProps {
  iconName: string;
  label?: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  iconColor?: string;
  textColor?: string;
  iconSize?: number;
}
