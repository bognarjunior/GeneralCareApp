import { StyleSheet } from 'react-native';
import theme from '@/theme';

const base = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  padding: theme.spacing.sm,
  borderRadius: theme.radius.md,
};

const styles = StyleSheet.create({
  container: {
    ...base,
    ...theme.shadows.sm,
  },
  containerFlat: {
    ...base,
    ...theme.shadows.none,
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
