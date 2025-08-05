import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { CardProps } from '@/types/components';
import CustomText from '@/components/CustomText';

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  onPress,
  style,
  rightIcon,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={[styles.card, style]} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.iconBox}>{icon}</View>
      <View style={styles.textBox}>
        <CustomText variant="title" weight="bold" style={styles.cardTitle}>
          {title}
        </CustomText>
        {!!description && (
          <CustomText variant="body" color="muted" style={styles.cardDesc}>
            {description}
          </CustomText>
        )}
      </View>
      {!!rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </Container>
  );
};

export default Card;
