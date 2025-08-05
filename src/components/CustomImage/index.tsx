import React from 'react';
import { Image } from 'react-native';
import styles from './styles';
import { CustomImageProps } from '@/types/components/CustomImage';
import theme from '@/theme';

const CustomImage: React.FC<CustomImageProps> = ({
  style,
  radius = 'lg',
  shadow = 'md',
  ...props
}) => {
  return (
    <Image
      style={[
        styles.image,
        radius && { borderRadius: theme.radius[radius] },
        shadow && theme.shadows[shadow],
        style,
      ]}
      {...props}
    />
  );
};

export default CustomImage;
