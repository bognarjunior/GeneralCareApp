import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  grid: {
    gap: theme.spacing.md,
  },
  loaderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
