// src/components/Toast/index.tsx (ou Toast.tsx, mantenha o mesmo caminho que já usa)
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import theme from '@/theme';
import CustomText from '@/components/CustomText';
import type { ToastProps, ToastVariant } from '@/types/components/Toast';

const paletteByVariant: Record<ToastVariant, { bg: string; border: string; text: string }> = {
  success: { bg: theme.colors.successLight, border: theme.colors.success, text: theme.colors.successDark },
  error:   { bg: theme.colors.dangerLight,  border: theme.colors.danger,  text: theme.colors.dangerDark  },
  info:    { bg: theme.colors.infoLight,    border: theme.colors.info,    text: theme.colors.infoDark    },
};

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  variant = 'info',
  duration = 1500,
  position = 'top',
  offset = theme.spacing.xl,
  onHide,
  testID = 'toast',
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const palette = useMemo(() => paletteByVariant[variant], [variant]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
          onHide?.();
        });
      }, duration);
    } else {
      opacity.setValue(0);
    }
    return () => timer && clearTimeout(timer);
  }, [visible, duration, onHide, opacity]);

  if (!visible) return null;

  const edgeStyle =
    position === 'top'
      ? { top: insets.top + offset }
      : { bottom: insets.bottom + offset };

  return (
    <View pointerEvents="none" style={[styles.wrapper, edgeStyle]}>
      <Animated.View
        testID={testID}
        style={[
          styles.container,
          { backgroundColor: palette.bg, borderColor: palette.border, opacity },
          style,
        ]}
      >
        <CustomText variant="body" weight="medium" style={[styles.text, { color: palette.text }]}>
          {message}
        </CustomText>
      </Animated.View>
    </View>
  );
};

export default Toast;
