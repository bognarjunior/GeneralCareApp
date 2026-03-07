import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
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
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    gap: theme.spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendDash: {
    width: 14,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  chartWrap: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.xs,
    overflow: 'hidden',
  },
  empty: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
  },
  loaderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
});
