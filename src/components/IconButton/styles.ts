import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    ...theme.shadows.sm,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.fonts.family.medium,
    fontSize: theme.fonts.size.md,
  },
});

export default styles;
