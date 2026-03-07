import { StyleSheet } from 'react-native';
import theme from '@/theme';

export const AXIS_TEXT_STYLE = {
  color: theme.colors.muted,
  fontSize: 9,
  fontFamily: theme.fonts.family.regular,
} as const;

export const REF_DASHED = {
  type: 'dashed' as const,
  dashWidth: 4,
  dashGap: 4,
  thickness: 1,
} as const;

export const REF_LABEL_SUCCESS = { color: theme.colors.success, fontSize: 9 } as const;
export const REF_LABEL_WARNING = { color: theme.colors.warning, fontSize: 9 } as const;

export default StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  loaderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  legendDotPrimary: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  legendDotDanger: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.danger,
  },
  legendDotInfo: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.info,
  },
  legendDotSecondary: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary,
  },
  legendDashSuccess: {
    width: 14,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: theme.colors.success,
  },
  legendDashWarning: {
    width: 14,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: theme.colors.warning,
  },
});
