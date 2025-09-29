import { Platform, StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },

  avatarBase: {
    alignSelf: 'center', 
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: (theme.colors as any).shadow ?? theme.colors.text,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },

  avatarEmpty: {
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  cameraFab: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
    ...Platform.select({
      ios: {
        shadowColor: (theme.colors as any).shadow ?? theme.colors.text,
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
      default: {},
    }),
  },

  disabled: {
    opacity: 0.5,
  },
});
