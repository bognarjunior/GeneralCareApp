import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.lg,
  },
  group: {
    gap: theme.spacing.md,
  },
  buttons: { marginTop: theme.spacing.lg },
});
