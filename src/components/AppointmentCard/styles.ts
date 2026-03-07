import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  rowMeta: {
    gap: 2,
    marginTop: theme.spacing.xs,
  },
  location: {
    marginTop: 2,
  },
  notes: {
    marginTop: 2,
  },
});
