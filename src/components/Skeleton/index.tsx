import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styles from './styles';
import theme from '@/theme';
import type { SkeletonProps } from '@/types/components/Skeleton';

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%' as `${number}%`,
  height = theme.spacing.lg,
  borderRadius = theme.radius.md,
  animated = true,
  style,
  testID = 'skeleton',
}) => {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animated, opacity]);

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.base,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export default Skeleton;
