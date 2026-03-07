import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
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
});
