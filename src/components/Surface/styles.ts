import { Platform, StyleSheet } from 'react-native';
import theme from '@/theme';

const shadowColor =
  (theme.colors as any).shadow ??
  (theme.colors as any).black ??
  theme.colors.text;

export default StyleSheet.create({
  root: { width: '100%' },

  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: theme.border.width.hairline,
    borderRadius: theme.radius.lg,
    ...Platform.select({
      ios: {
        shadowColor,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
      default: {},
    }),
  },

  shadow: {
    borderRadius: theme.radius.lg,
    ...Platform.select({
      ios: {
        shadowColor,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
      default: {},
    }),
  },

  gradientBox: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },

  content: {
    width: '100%',
    gap: theme.spacing.md,
  },

  gradientFill: {
    width: '100%',
  },
});
