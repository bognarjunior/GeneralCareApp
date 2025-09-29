import { StyleProp, ViewStyle } from 'react-native';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastProps {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onHide?: () => void;
  position?: 'top' | 'bottom';
  offset?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}
