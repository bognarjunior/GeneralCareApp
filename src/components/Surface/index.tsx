import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import theme from '@/theme';
import type { SurfaceProps } from '@/types/components/Surface';

function resolvePadding(pad: SurfaceProps['padding']): number {
  if (typeof pad === 'number') return pad;
  switch (pad) {
    case 'sm': return theme.spacing.sm;
    case 'md': return theme.spacing.md;
    case 'xl': return theme.spacing.xl;
    case 'lg':
    default:   return theme.spacing.lg;
  }
}

const Surface: React.FC<SurfaceProps> = ({
  children,
  style,
  gradient = false,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  padding = 'lg',
  ...rest
}) => {
  const paddingValue = resolvePadding(padding);

  if (gradient) {
    const colors = gradientColors ?? theme.gradients.surface.soft;
    return (
      <View style={[styles.root, styles.shadow, style]} {...rest}>
        <View style={styles.gradientBox}>
          <LinearGradient
            colors={colors}
            start={gradientStart}
            end={gradientEnd}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <View style={[styles.content, { padding: paddingValue }]}>
            {children}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { padding: paddingValue }, style]} {...rest}>
      {children}
    </View>
  );
};

export default Surface;
