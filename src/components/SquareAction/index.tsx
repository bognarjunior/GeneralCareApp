import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import type { SquareActionProps } from '@/types/components/SquareAction';

const SquareAction: React.FC<SquareActionProps> = ({
  colors,
  iconName,
  label,
  onPress,
  style,
  testID = 'square-action',
  contentTestID = 'square-action-content',
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const isSingleWord = useMemo(() => !/\s/.test(label), [label]);
  return (
    <Container
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.filler} />
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content} testID={contentTestID}>
        <View style={styles.iconWrap}>
          <Icon
            name={iconName}
            size={theme.fonts.size.display}
            color={theme.colors.white}
          />
        </View>

        <CustomText
          variant="body"
          weight="medium"
          style={styles.label}
          numberOfLines={isSingleWord ? 1 : 2}
          allowFontScaling={false}
          ellipsizeMode="tail"
        >
          {label}
        </CustomText>
      </View>
    </Container>
  );
};

export default SquareAction;
