import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  title: {
    textAlign: 'left',
    marginBottom: theme.spacing.md,
    lineHeight: theme.fonts.lineHeight.display,
  },
  titleHighlight: {
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  description: {
    textAlign: 'left',
    marginBottom: theme.spacing.xl,
  },
  heroImage: {
    marginVertical: theme.spacing.xl,
  },
  cardsArea: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default styles;
