import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  loading: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
