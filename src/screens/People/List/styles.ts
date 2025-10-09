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
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.size.xxl,
    fontFamily: theme.fonts.family.bold,
    marginBottom: theme.spacing.lg,
  },
});

export default styles;
