import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fonts.size.xlarge,
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 6,
    gap: theme.spacing.xs,
  },
  buttonText: {
    color: '#FFF',
    fontSize: theme.fonts.size.medium,
    marginLeft: theme.spacing.xs,
  },
});

export default styles;
