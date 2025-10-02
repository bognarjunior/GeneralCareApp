import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  wrapperDisabled: { opacity: 0.5 },

  inner: {
    width: '100%',
    minHeight: 48,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
  },

  text: {},
  group: {
    width: '100%',
    alignItems: 'stretch',
  },
  equal: { flex: 1 },
});

export default styles;