import type { ReactNode } from 'react';

export type ActionSheetAction = {
  label: string;
  iconName?: string;
  tint?: 'default' | 'danger';
  onPress: () => void;
};

export interface ActionSheetProps {
  visible: boolean;
  actions: ActionSheetAction[];
  onClose: () => void;
  title?: string | ReactNode;
  testID?: string;
}
