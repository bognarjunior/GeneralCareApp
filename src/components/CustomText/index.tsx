import React from 'react';
import { Text } from 'react-native';
import theme from '@/theme';
import { CustomTextProps, Variant, Weight } from '@/types/components/CustomText';
import styles from './styles';

const variantMap: Record<Variant, number> = {
  display: theme.fonts.size.display,
  title: theme.fonts.size.xl,
  subtitle: theme.fonts.size.lg,
  body: theme.fonts.size.md,
  caption: theme.fonts.size.sm,
};

const weightMap: Record<Weight, string> = {
  light: theme.fonts.family.light,
  regular: theme.fonts.family.regular,
  medium: theme.fonts.family.medium,
  semibold: theme.fonts.family.semibold,
  bold: theme.fonts.family.bold,
};

const CustomText: React.FC<CustomTextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = theme.colors.text,
  style,
  children,
  ...props
}) => (
  <Text
    style={[
      styles.text,
      {
        fontSize: variantMap[variant],
        fontFamily: weightMap[weight],
        color: color in theme.colors ? theme.colors[color as keyof typeof theme.colors] : color,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

export default CustomText;
