import { Platform, StyleSheet } from 'react-native';
import theme from '@/theme';

const INPUT_HEIGHT = 48;
const PAD_H = theme.spacing.md;
const PAD_V = Platform.select({ ios: 12, android: 8 }) as number;

export default StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },

  input: {
    width: '100%',
    height: INPUT_HEIGHT,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingLeft: PAD_H,
    paddingRight: PAD_H,
    paddingVertical: PAD_V,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDisabled: {
    opacity: theme.opacity.low,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },

  value: {
    flex: 1,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.size.md,
    lineHeight: Math.round(theme.fonts.size.md * 1.25),
    includeFontPadding: false,
  },

  iconBox: {
    width: INPUT_HEIGHT - PAD_V * 2,
    height: INPUT_HEIGHT - PAD_V * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },

  error: {
    marginTop: theme.spacing.xs,
  },

  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.spacing.md,
  },
  headerBtn: {
    padding: theme.spacing.sm,
  },
  iosPicker: {
    alignSelf: 'stretch',
  },
});
