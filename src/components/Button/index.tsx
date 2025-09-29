// src/components/Button/index.tsx
import React from 'react';
import { TouchableOpacity, View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import type { ButtonProps, ButtonGroupProps } from '@/types/components/Button';

const bgByVariant = {
  primary: theme.colors.primary,
  secondary: theme.colors.muted,
  danger: theme.colors.danger,
  ghost: 'transparent',
} as const;

const fgByVariant = {
  primary: theme.colors.white,
  secondary: theme.colors.white,
  danger: theme.colors.white,
  ghost: theme.colors.text,
} as const;

const gByVariant = {
  primary: theme.gradients.button.primary,
  secondary: theme.gradients.button.secondary,
  danger: theme.gradients.button.danger,
  ghost: theme.gradients.button.ghost,
} as const;

const ButtonBase: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  disabled,
  gradient = false,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  style,
  textStyle,
  onPress,
  testID,
  ...touchableProps
}) => {
  const bg = bgByVariant[variant];
  const fg = fgByVariant[variant];
  const gColors = gradientColors ?? gByVariant[variant];
  const useGradient = gradient && variant !== 'ghost' && !disabled;

  const Content = (
    <CustomText variant="body" weight="semibold" style={[styles.text, { color: fg }, textStyle]}>
      {label}
    </CustomText>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={[styles.wrapper, disabled && styles.wrapperDisabled, style]}
      {...touchableProps}
    >
      {/* O VIEW define largura/altura; o gradiente vira fundo absoluto */}
      <View style={[styles.inner, { backgroundColor: bg }]}>
        {useGradient && (
          <LinearGradient
            colors={gColors}
            start={gradientStart}
            end={gradientEnd}
            // preenche 100% do inner sem afetar layout
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {Content}
      </View>
    </TouchableOpacity>
  );
};

function gapToPx(gap: ButtonGroupProps['gap']): number {
  if (typeof gap === 'number') return gap;
  if (!gap) return 12;
  return theme.spacing[gap] ?? 12;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  gap = 12,
  direction = 'row',
  equal,
  style,
}) => {
  const px = gapToPx(gap);
  const nodes = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];

  return (
    <View style={[styles.group, { flexDirection: direction }, style]}>
      {nodes.map((child, idx) => {
        if (!React.isValidElement(child)) return child;
        const isLast = idx === nodes.length - 1;
        const childStyle: StyleProp<ViewStyle> = (child.props as any)?.style ?? [];
        const margin =
          direction === 'row'
            ? { marginRight: isLast ? 0 : px }
            : { marginBottom: isLast ? 0 : px };

        return React.cloneElement(child as React.ReactElement<{ style?: StyleProp<ViewStyle> }>, {
          style: [equal && styles.equal, childStyle, margin],
        });
      })}
    </View>
  );
};

const Button = ButtonBase as React.FC<ButtonProps> & { Group: React.FC<ButtonGroupProps> };
Button.Group = ButtonGroup;

export default Button;
