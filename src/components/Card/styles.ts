import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  iconBox: {
    width: theme.sizes.icon.xl,
    height: theme.sizes.icon.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + '11',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: theme.fonts.size.lg,
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.muted,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.muted,
  },
});

export default styles;
