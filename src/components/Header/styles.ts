import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.sizes.icon.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: theme.border.width.hairline,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  left: {
    width: theme.sizes.icon.xl,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    minWidth: theme.sizes.icon.xl,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});

export default styles;
