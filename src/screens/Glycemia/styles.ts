import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: 0,
    gap: theme.spacing.sm,
  },

  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },

  loaderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  emptyText: { 
    textAlign: 'center' 
  },

  itemSpacing: {
    marginBottom: theme.spacing.sm,
  },
});