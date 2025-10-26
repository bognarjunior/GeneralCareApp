import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  grabberWrap: {
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    opacity: 0.9,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  titleText: {},
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  list: {
    paddingVertical: theme.spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  itemLabel: {
    marginLeft: theme.spacing.md,
  },
  divider: {
    height: theme.border.width.hairline,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.lg + theme.sizes.icon.md,
  },
});

export default styles;
