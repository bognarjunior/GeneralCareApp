import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.size.xxxl,
    fontFamily: theme.fonts.family.bold,
    marginBottom: theme.spacing.lg,
  },
});

export default styles;
