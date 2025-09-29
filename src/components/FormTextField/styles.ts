import { Platform, StyleSheet } from 'react-native';
import theme from '@/theme';

const INPUT_HEIGHT = 48;
const PAD_H = theme.spacing.md;
const PAD_V = Platform.select({ ios: 12, android: 8 }) as number;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },

  field: {
    width: '100%',
    height: INPUT_HEIGHT,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingLeft: PAD_H,
    paddingRight: PAD_H,
    paddingVertical: PAD_V,
    justifyContent: 'center',
  },
  fieldError: {
    borderColor: theme.colors.danger,
  },

  input: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.size.md,
    lineHeight: Math.round(theme.fonts.size.md * 1.25),
    color: theme.colors.text,
    includeFontPadding: false,
  },

  inputSingleAndroid: {
    textAlignVertical: 'center',
  },

  inputMultiline: {
    textAlignVertical: 'top',
  },

  error: {
    marginTop: theme.spacing.xs,
  },

  placeholderColor: {
    color: theme.colors.muted,
  },
});

export default styles;
