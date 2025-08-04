import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fonts.size.xl,
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  info: {
    fontSize: theme.fonts.size.lg,
    fontFamily: theme.fonts.family.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  navGroup: {
    gap: theme.spacing.sm,
    width: '100%',
  },
});

export default styles;
