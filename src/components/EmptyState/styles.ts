import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  intro: {
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardWrapper: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: theme.spacing.sm,
  },
});

export default styles;
