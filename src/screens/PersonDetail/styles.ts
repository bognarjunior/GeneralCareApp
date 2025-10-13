import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
  },

  cardWrap: {
    marginBottom: theme.spacing.lg,
    alignItems: 'stretch',
  },

  card: {
    borderRadius: theme.radius.lg,
  },

  avatarWrap: {
    position: 'absolute',
    top: -48,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
    overflow: 'hidden',
    zIndex: 2,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.lg,
  },

  name: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.xl,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  age: {
    color: theme.colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.xl,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  obs: {
    color: theme.colors.white,
  },

  actions: {
    gap: theme.spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  actionLabel: {
    color: theme.colors.white,
  },
});

export default styles;
