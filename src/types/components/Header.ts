import type { Variant } from '@/types/components/CustomText';
export type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  titleVariant?: Variant;
  testID?: string;
};
