import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styles from './styles';
import theme from '@/theme';

type Props = {
  hasMore: boolean;
  testID?: string;
};

const ListFooterProgress: React.FC<Props> = ({ hasMore, testID = 'list-footer-progress' }) => {
  if (!hasMore) return <View style={styles.spacer} testID={`${testID}-spacer`} />;
  return (
    <View style={styles.loading} testID={`${testID}-loading`}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  );
};

export default ListFooterProgress;
