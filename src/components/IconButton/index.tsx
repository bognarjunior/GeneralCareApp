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
  iconSize = theme.sizes.icon.md,
  testID = 'icon-button',
}) => {
  const containerStyle =
    backgroundColor === 'transparent' ? styles.containerFlat : styles.container;

  return (
    <TouchableOpacity
      style={[containerStyle, { backgroundColor }]}
      onPress={onPress}
      testID={testID}
    >
      <Icon
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
        testID="icon-button-icon"
      />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;
