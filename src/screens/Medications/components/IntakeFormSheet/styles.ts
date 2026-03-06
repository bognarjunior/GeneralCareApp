import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  group: { gap: theme.spacing.md },
  medicationInfo: {
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: theme.border.width.hairline,
    borderBottomColor: theme.colors.border,
  },
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
