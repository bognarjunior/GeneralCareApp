import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  message: {
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: 0,
  },
  actionButtonFull: {
    alignSelf: 'stretch',
  },
});

export default styles;
