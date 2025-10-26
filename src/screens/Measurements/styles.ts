import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyText: { textAlign: 'center' },
  row: {
    borderRadius: theme.radius.lg,
  },
  rowLeft: { flex: 1, gap: 2 },
  rowRight: { minWidth: 140, alignItems: 'flex-end', gap: 2 },
  rowActions: { flexDirection: 'row', gap: theme.spacing.xs, marginTop: theme.spacing.xs },
});
