// src/components/FormDateField/styles.ts
import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({

  wrapper: {
    marginBottom: theme.spacing.lg,
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,

    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  inputDisabled: {
    opacity: 0.6,
  },

  value: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  error: {
    marginTop: theme.spacing.sm,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },

  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,

    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
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
    paddingVertical: theme.spacing.xs ?? 6, 
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },

  iosPicker: {
    height: 260, 
  },
});

export default styles;
