import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  loaderArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyText: { textAlign: 'center' },

  row: {
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  weightText: {
    fontSize: theme.fonts.size.lg,
  },
  notes: {
    marginTop: 2,
  },
  rowBottom: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  /** Swipe actions */
  rightActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  swipeBtn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeEdit: {
    backgroundColor: theme.colors.primary,
  },
  swipeDelete: {
    backgroundColor: theme.colors.danger,
  },

  itemSpacing: {
    marginBottom: theme.spacing.sm,
  },

  footerLoading: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSpacer: {
    height: theme.spacing.xl,
  },
});
