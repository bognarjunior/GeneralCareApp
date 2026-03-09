import React from 'react';
import { View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';

export interface SummaryCardProps {
  iconName: string;
  label: string;
  value: string;
  subValue: string;
  stripeColor: string;
  onPress?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  iconName, label, value, subValue, stripeColor, onPress,
}) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={[styles.cardStripe, { backgroundColor: stripeColor }]} />
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <Icon name={iconName} size={14} color={theme.colors.muted} />
        <CustomText variant="caption" color="muted">{label}</CustomText>
      </View>
      <CustomText weight="bold" style={styles.cardValue}>{value}</CustomText>
      <CustomText variant="caption" color="muted">{subValue}</CustomText>
    </View>
  </Pressable>
);

export default SummaryCard;
