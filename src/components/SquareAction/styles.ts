// src/components/SquareAction/styles.ts
import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.radius.md,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: theme.spacing.sm,
  },
  iconWrap: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: theme.fonts.size.md * 1.25,
  },
});

export default styles;
