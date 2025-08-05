import { ImageProps, StyleProp, ImageStyle } from 'react-native';
import theme from '@/theme';

export type RadiusKey = keyof typeof theme.radius;
export type ShadowKey = keyof typeof theme.shadows;

export interface CustomImageProps extends ImageProps {
  radius?: RadiusKey;
  shadow?: ShadowKey | false;
  style?: StyleProp<ImageStyle>;
}
