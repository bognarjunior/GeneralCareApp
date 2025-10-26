import React from 'react';
import { View } from 'react-native';
import CustomText from '@/components/CustomText';
import IconButton from '@/components/IconButton';
import type { Measurement } from '@/repositories/measurementsRepository';
import styles from './styles';
import theme from '@/theme';

export type MeasurementCardProps = {
  item: Measurement;
  onEdit: (m: Measurement) => void;
  onDelete: (id: string) => void;
  testID?: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString();

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const MeasurementCard: React.FC<MeasurementCardProps> = ({
  item,
  onEdit,
  onDelete,
  testID = 'measurement-card',
}) => {
  return (
    <View style={styles.card} testID={`${testID}-${item.id}`}>
      {/* Linha superior: data + hora à esquerda, peso à direita */}
      <View style={styles.rowTop}>
        <View style={styles.dateWrap}>
          <CustomText weight="bold">{formatDate(item.dateISO)}</CustomText>
          <CustomText color="muted" style={styles.dot}>•</CustomText>
          <CustomText color="muted" style={styles.time}>{formatTime(item.dateISO)}</CustomText>
        </View>
        <CustomText weight="bold" style={styles.weightText}>
          {item.weightKg} kg
        </CustomText>
      </View>

      {/* Notas (1 linha opcional) */}
      {!!item.notes?.trim() && (
        <CustomText
          color="muted"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.notes}
        >
          {item.notes.trim()}
        </CustomText>
      )}

      {/* Linha inferior: altura · IMC | botões */}
      <View style={styles.rowBottom}>
        <View style={styles.metaWrap}>
          <CustomText color="muted">{item.heightCm} cm</CustomText>
          <CustomText color="muted" style={styles.dot}>•</CustomText>
          <CustomText color="muted">IMC {item.bmi}</CustomText>
        </View>

        <View style={styles.actions}>
          <IconButton
            iconName="edit"
            onPress={() => onEdit(item)}
            backgroundColor="transparent"
            iconColor={theme.colors.text}
            textColor={theme.colors.text}
            iconSize={theme.sizes.icon.md}
            testID={`${testID}-edit-${item.id}`}
          />
          <IconButton
            iconName="delete"
            onPress={() => onDelete(item.id)}
            backgroundColor="transparent"
            iconColor={theme.colors.danger}
            textColor={theme.colors.danger}
            iconSize={theme.sizes.icon.md}
            testID={`${testID}-del-${item.id}`}
          />
        </View>
      </View>
    </View>
  );
};

export default MeasurementCard;
