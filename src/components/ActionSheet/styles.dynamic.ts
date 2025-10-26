import { StyleSheet, Dimensions } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import theme from '@/theme';

export function getActionSheetDynamicStyles(insets: EdgeInsets) {
  const { height } = Dimensions.get('window');
  const topGap = insets.top + theme.spacing.lg;
  const maxHeight = Math.max(320, height - topGap);

  return StyleSheet.create({
    sheetMax: { maxHeight },
  });
}
