import type { StyleProp, ViewStyle } from 'react-native';
export type PersonListItemProps = {
  fullName: string;
  ageLabel?: string;
  avatarUri?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
