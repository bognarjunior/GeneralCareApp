import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  header: {
    textAlign: 'left',
  },
  formGroup: {
    gap: theme.spacing.sm,
  },
});
