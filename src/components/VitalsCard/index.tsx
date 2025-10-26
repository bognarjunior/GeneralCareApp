import React from 'react';
import { View } from 'react-native';
import CustomText from '@/components/CustomText';
import IconButton from '@/components/IconButton';
import styles from './styles';
import theme from '@/theme';
import { formatISOToDDMMYYYY_HHmm, formatHHmm } from '@/utils/date';
import type { VitalsCardProps } from '@/types/components/VitalsCard';

const VitalsCard: React.FC<VitalsCardProps> = ({
  dateISO,
  value,
  unit,
  metaLeft,
  notes,
  onEdit,
  onDelete,
  testID = 'vitals-card',
}) => {
  const datePart = formatISOToDDMMYYYY_HHmm(dateISO).split(' ')[0];
  const timePart = formatHHmm(new Date(dateISO));

  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.rowTop}>
        <View style={styles.dateWrap}>
          <CustomText weight="bold">{datePart}</CustomText>
          <CustomText color="muted" style={styles.dot}>•</CustomText>
          <CustomText color="muted" style={styles.time}>{timePart}</CustomText>
        </View>

        <CustomText weight="bold" style={styles.valueText}>
          {value}{unit ? ` ${unit}` : ''}
        </CustomText>
      </View>

      {!!notes?.trim() && (
        <CustomText color="muted" numberOfLines={1} ellipsizeMode="tail" style={styles.notes}>
          {notes.trim()}
        </CustomText>
      )}

      <View style={styles.rowBottom}>
        <View style={styles.metaWrap}>
          {typeof metaLeft === 'string' ? (
            <CustomText color="muted">{metaLeft}</CustomText>
          ) : (
            metaLeft
          )}
        </View>

        <View style={styles.actions}>
          {!!onEdit && (
            <IconButton
              iconName="edit"
              onPress={onEdit}
              backgroundColor="transparent"
              iconColor={theme.colors.text}
              textColor={theme.colors.text}
              iconSize={theme.sizes.icon.md}
              testID={`${testID}-edit`}
            />
          )}
          {!!onDelete && (
            <IconButton
              iconName="delete"
              onPress={onDelete}
              backgroundColor="transparent"
              iconColor={theme.colors.danger}
              textColor={theme.colors.danger}
              iconSize={theme.sizes.icon.md}
              testID={`${testID}-delete`}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default VitalsCard;
