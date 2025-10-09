import React, { memo, useMemo } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';
import type { PersonListItemProps } from '@/types/components/PersonListItem';
import { getInitials } from '@/utils/formatters/person';

const PersonListItem: React.FC<PersonListItemProps> = ({
  fullName,
  ageLabel,
  avatarUri,
  onPress,
  style,
  testID = 'person-list-item',
}) => {
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const contentVariantStyle = ageLabel ? styles.contentTop : styles.contentCenter;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, style]}
      testID={testID}
    >
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
          resizeMode="cover"
          testID="person-item-avatar-image"
        />
      ) : (
        <View style={styles.avatar} testID="person-item-avatar-fallback">
          <CustomText style={styles.avatarText} weight="bold">
            {initials}
          </CustomText>
        </View>
      )}

      <View style={[styles.contentBase, contentVariantStyle]}>
        <CustomText style={styles.name}>
          {fullName}
        </CustomText>

        {ageLabel ? (
          <CustomText variant="caption" color="muted" style={styles.age}>
            {ageLabel}
          </CustomText>
        ) : null}
      </View>

      <Icon
        name="chevron-right"
        size={theme.fonts.size.xl}
        color={theme.colors.muted}
        style={styles.chevron}
        testID="person-item-chevron"
      />
    </TouchableOpacity>
  );
};

export default memo(PersonListItem);
