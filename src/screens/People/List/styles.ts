import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
  },
  searchBox: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: theme.border.width.hairline,
    borderBottomColor: theme.colors.border,
  },
  listArea: {
    paddingTop: theme.spacing.md,
  },
  spacer: {
    height: theme.spacing.xl,
  },
  search: {
    marginBottom: theme.spacing.sm,
  },
  itemSpacing: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.background,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.size.xxl,
    fontFamily: theme.fonts.family.bold,
    marginBottom: theme.spacing.lg,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    marginLeft: theme.spacing.sm,
  },
  skeletonItem: {
    height: 72,
    borderRadius: theme.radius.lg,
  },
});

export default styles;
