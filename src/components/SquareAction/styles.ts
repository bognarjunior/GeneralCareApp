import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  filler: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.md,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  iconWrap: { marginBottom: theme.spacing.xs },
  label: {
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: theme.fonts.size.md * 1.2,
    fontSize: theme.fonts.size.md,
  },
});

export default styles;
