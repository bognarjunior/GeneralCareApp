import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  chip: {
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Math.max(8, Math.floor(theme.spacing.xs)),
    borderWidth: theme.border.width.hairline,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipInactive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  chipLabel: {
    fontSize: theme.fonts.size.sm,
  },
});
