import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },

  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },

  surface: {
    marginTop: theme.spacing.sm,
  },

  formGroup: {
    gap: theme.spacing.md,
  },

  notesInput: {
    minHeight: 120,
  },

  buttons: {
    marginTop: theme.spacing.lg,
  },
  
  skeletonButton: {
    width: '100%',
    borderRadius: theme.radius.md,
  },
});

export default styles;
