import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  grid: {
    gap: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardStripe: {
    width: 5,
  },
  cardBody: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  cardValue: {
    fontSize: theme.fonts.size.xlarge,
  },
  loaderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
