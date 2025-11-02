import { StyleSheet } from 'react-native';
import theme from '@/theme';

const CHIP_HEIGHT_COMPACT = 28;
const CHIP_HEIGHT_COZY = 32;

export default StyleSheet.create({
  scrollRoot: {
    flexGrow: 0,
    flexShrink: 0,
    maxHeight: CHIP_HEIGHT_COZY + theme.spacing.sm * 2,
  },

  containerBase: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  containerCompact: {},
  containerCozy: {},

  rowWrap: {
    flexWrap: 'wrap',
  },

  chip: {
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: theme.border.width.hairline,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipSpacing: {
    marginRight: theme.spacing.sm,
  },

  chipCompact: {
    height: CHIP_HEIGHT_COMPACT,
    paddingHorizontal: Math.max(10, theme.spacing.sm),
  },

  chipCozy: {
    height: CHIP_HEIGHT_COZY,
    paddingHorizontal: theme.spacing.md,
  },

  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  chipLabelCompact: {},
  chipLabelCozy: {},
});
