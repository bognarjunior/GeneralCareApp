import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  periodRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  periodChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  periodChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodChipText: {
    fontFamily: theme.fonts.family.semibold,
    fontSize: theme.fonts.size.small,
    color: theme.colors.muted,
  },
  periodChipTextActive: {
    color: theme.colors.white,
  },
});
