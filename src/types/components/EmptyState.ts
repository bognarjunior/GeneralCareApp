import type { ReactNode } from 'react';

export interface EmptyStateAction {
  title: string;
  description?: string;
  onPress: () => void;
  iconName?: string;
  rightIcon?: ReactNode;
}

export interface EmptyStateProps {
  message: string;
  intro?: string;
  action?: EmptyStateAction;
  testID?: string;
}
