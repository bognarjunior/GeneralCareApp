import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import Card from '@/components/Card';
import theme from '@/theme';
import styles from './styles';
import type { EmptyStateProps } from '@/types/components/EmptyState';

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  intro,
  action,
  testID = 'empty-state',
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <CustomText variant="title" weight="bold" color="text" style={styles.message}>
        {message}
      </CustomText>

      {intro ? (
        <CustomText variant="body" color="text" style={styles.intro}>
          {intro}
        </CustomText>
      ) : null}
      {action ? (
        <View style={styles.cardWrapper}>
          <Card
            icon={
              <Icon
                name={action.iconName ?? 'person-add-alt'}
                size={theme.fonts.size.xxxl}
                color={theme.colors.primary}
              />
            }
            title={action.title}
            description={action.description}
            onPress={action.onPress}
            rightIcon={
              action.rightIcon ?? (
                <Icon
                  name="chevron-right"
                  size={theme.fonts.size.xl}
                  color={theme.colors.muted}
                />
              )
            }
          />
        </View>
      ) : null}
    </View>
  );
};

export default EmptyState;
