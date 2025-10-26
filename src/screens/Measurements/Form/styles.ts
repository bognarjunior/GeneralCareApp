import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  surface: { borderRadius: theme.radius.lg },
  group: { gap: theme.spacing.md },
  buttons: { marginTop: theme.spacing.lg },
});
