import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1000,
  },
  container: {
    borderWidth: theme.border.width.hairline,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default styles;