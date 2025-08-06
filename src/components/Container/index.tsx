import React from 'react';
import { SafeAreaView } from 'react-native';
import styles from './styles';
import type { ContainerProps } from '@/types/components/Container';

const Container: React.FC<ContainerProps> = ({ children, style, testID }) => (
  <SafeAreaView style={[styles.safeArea, style]} testID={testID} >{children}</SafeAreaView>
);

export default Container;
