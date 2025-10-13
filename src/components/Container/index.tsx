import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import type { ContainerProps } from '@/types/components/Container';

const Container: React.FC<ContainerProps & { edges?: Array<'top'|'bottom'|'left'|'right'> }> = ({
  children,
  style,
  testID,
  edges = ['left', 'right'],
}) => (
  <SafeAreaView style={[styles.safeArea, style]} edges={edges} testID={testID}>
    {children}
  </SafeAreaView>
);

export default Container;
