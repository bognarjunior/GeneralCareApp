import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconButton from '@/components/IconButton';
import CustomText from '@/components/CustomText';
import styles from './styles';
import type { HeaderProps } from '@/types/components/Header';
import theme from '@/theme';

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress = () => {},
  titleVariant = 'subtitle',
  testID = 'app-header',
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea} testID={testID}>
      <View style={styles.container}>
        <View style={styles.left}>
          {showBack ? (
            <IconButton
              iconName="arrow-back"
              onPress={onBackPress}
              backgroundColor="transparent"
              iconColor={theme.colors.text}
              textColor={theme.colors.text}
            />
          ) : null}
        </View>

        <View style={styles.center}>
          <CustomText variant={titleVariant} weight="bold" color="text">
            {title}
          </CustomText>
        </View>

        <View style={styles.right} />
      </View>
    </SafeAreaView>
  );
};

export default Header;
