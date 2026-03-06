import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardInactive: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  headerRight: {
    paddingLeft: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  name: {
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  badgeActive: {
    backgroundColor: theme.colors.success + '20',
  },
  badgeInactive: {
    backgroundColor: theme.colors.border,
  },
  badgeTextActive: {
    color: theme.colors.success,
    fontSize: 11,
    fontFamily: theme.fonts.family.semibold,
  },
  badgeTextInactive: {
    color: theme.colors.muted,
    fontSize: 11,
    fontFamily: theme.fonts.family.semibold,
  },
  times: {
    marginTop: 2,
  },
  body: {
    borderTopWidth: theme.border.width.hairline,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  scheduleList: {
    gap: theme.spacing.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  scheduleTime: {
    fontFamily: theme.fonts.family.semibold,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  actionBtnText: {
    color: theme.colors.primary,
  },
  iconActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
