import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  group: { gap: theme.spacing.md },
  label: {
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  pickerBox: {
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  buttons: { marginTop: theme.spacing.lg },
});
