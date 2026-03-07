import React from 'react';
import { View } from 'react-native';
import CustomText from '@/components/CustomText';
import IconButton from '@/components/IconButton';
import theme from '@/theme';
import styles from './styles';
import { formatISOToDDMMYYYY_HHmm } from '@/utils/date';
import type { AppointmentCardProps } from '@/types/components/AppointmentCard';

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  onEdit,
  onDelete,
  testID = 'appointment-card',
}) => {
  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.rowTop}>
        <CustomText weight="bold" style={styles.dateText}>
          {formatISOToDDMMYYYY_HHmm(item.dateISO)}
        </CustomText>

        <View style={styles.actions}>
          <IconButton
            iconName="edit"
            onPress={() => onEdit(item)}
            backgroundColor="transparent"
            iconColor={theme.colors.text}
            textColor={theme.colors.text}
            iconSize={theme.sizes.icon.md}
            testID={`${testID}-edit`}
          />
          <IconButton
            iconName="delete"
            onPress={() => onDelete(item.id)}
            backgroundColor="transparent"
            iconColor={theme.colors.danger}
            textColor={theme.colors.danger}
            iconSize={theme.sizes.icon.md}
            testID={`${testID}-delete`}
          />
        </View>
      </View>

      {(!!item.doctor || !!item.specialty) && (
        <View style={styles.rowMeta}>
          {!!item.doctor && (
            <CustomText weight="semibold" variant="body">{item.doctor}</CustomText>
          )}
          {!!item.specialty && (
            <CustomText variant="caption" color="muted">{item.specialty}</CustomText>
          )}
        </View>
      )}

      {!!item.location && (
        <CustomText variant="caption" color="muted" style={styles.location}>
          📍 {item.location}
        </CustomText>
      )}

      {!!item.notes?.trim() && (
        <CustomText
          variant="caption"
          color="muted"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.notes}
        >
          {item.notes.trim()}
        </CustomText>
      )}
    </View>
  );
};

export default AppointmentCard;
