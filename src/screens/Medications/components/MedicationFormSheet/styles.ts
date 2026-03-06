import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  group: { gap: theme.spacing.md },
  label: {
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  timeInput: {
    flex: 1,
    height: 44,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.size.medium,
    backgroundColor: theme.colors.surface,
  },
  addTimeBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeBtnDisabled: {
    backgroundColor: theme.colors.border,
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight + '30',
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chipText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.family.semibold,
  },
  buttons: { marginTop: theme.spacing.lg },
});
