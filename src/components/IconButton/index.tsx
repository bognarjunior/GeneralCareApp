import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IconButtonProps } from '@/types/components/IconButton';
import styles from './styles';
import theme from '@/theme';

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  label,
  onPress,
  backgroundColor = theme.colors.primary,
  iconColor = theme.colors.white,
  textColor = theme.colors.white,
}) => {
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
    >
      <Icon name={iconName} size={20} color={iconColor} style={styles.icon} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;
