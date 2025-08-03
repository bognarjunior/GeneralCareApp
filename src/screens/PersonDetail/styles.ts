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
    fontSize: theme.fonts.size.xlarge,
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  info: {
    fontSize: theme.fonts.size.large,
    color: theme.colors.text,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 6,
    marginTop: theme.spacing.lg,
  },
  backText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: theme.fonts.size.medium,
  },
});

export default styles;
