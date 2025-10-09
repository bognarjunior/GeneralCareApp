import { StyleSheet } from 'react-native';
import theme from '@/theme';

const AVATAR = theme.sizes.icon.xl;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.fonts.family.semibold,
    fontSize: theme.fonts.size.lg,
  },
  contentBase: {
    flex: 1,
    height: AVATAR,
  },
  contentTop: {
    justifyContent: 'flex-start',
    paddingTop: 0,
    gap: theme.spacing.xs,
  },
  contentCenter: {
    justifyContent: 'center',
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.bold,
  },
  age: {
    color: theme.colors.muted,
  },
  chevron: {
    marginLeft: theme.spacing.sm,
  },
});

export default styles;
