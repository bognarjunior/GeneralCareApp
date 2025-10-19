import type { Variant } from '@/types/components/CustomText';
import type { ReactNode } from 'react';

export type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  titleVariant?: Variant;
  rightContent?: ReactNode;
  testID?: string;
};
