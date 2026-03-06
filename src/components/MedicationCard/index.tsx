import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import IconButton from '@/components/IconButton';
import theme from '@/theme';
import styles from './styles';
import type { MedicationCardProps } from '@/types/components/MedicationCard';

const MedicationCard: React.FC<MedicationCardProps> = ({
  item,
  todayIntakes,
  onEdit,
  onDelete,
  onLogIntake,
  onViewHistory,
  testID = 'medication-card',
}) => {
  const [expanded, setExpanded] = useState(false);

  const intakesForThisMed = todayIntakes.filter((i) => i.medicationId === item.id);

  const scheduleStatus = item.scheduleTimes.map((time) => {
    const intake = intakesForThisMed.find((i) => i.scheduledTime === time);
    return { time, intake };
  });

  const hasSchedule = item.scheduleTimes.length > 0;

  return (
    <View style={[styles.card, !item.isActive && styles.cardInactive]} testID={testID}>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.header}
        testID={`${testID}-toggle`}
      >
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <CustomText weight="bold" variant="body" style={styles.name}>
              {item.name}
            </CustomText>
            <View style={[styles.badge, item.isActive ? styles.badgeActive : styles.badgeInactive]}>
              <CustomText variant="caption" style={item.isActive ? styles.badgeTextActive : styles.badgeTextInactive}>
                {item.isActive ? 'Ativo' : 'Inativo'}
              </CustomText>
            </View>
          </View>

          {!!item.dosage && (
            <CustomText variant="caption" color="muted">{item.dosage}</CustomText>
          )}

          {hasSchedule && !expanded && (
            <CustomText variant="caption" color="muted" style={styles.times}>
              {item.scheduleTimes.join(' • ')}
            </CustomText>
          )}
        </View>

        <View style={styles.headerRight}>
          <Icon
            name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={theme.sizes.icon.md}
            color={theme.colors.muted}
          />
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          {hasSchedule && (
            <View style={styles.scheduleList}>
              {scheduleStatus.map(({ time, intake }) => (
                <View key={time} style={styles.scheduleRow}>
                  <Icon
                    name={intake ? 'check-circle' : 'radio-button-unchecked'}
                    size={18}
                    color={intake ? theme.colors.success : theme.colors.muted}
                  />
                  <CustomText variant="body" style={styles.scheduleTime}>{time}</CustomText>
                  {intake && (
                    <CustomText variant="caption" color="muted">
                      tomou às {new Date(intake.dateISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </CustomText>
                  )}
                </View>
              ))}

              {intakesForThisMed.filter((i) => !i.scheduledTime).map((intake) => (
                <View key={intake.id} style={styles.scheduleRow}>
                  <Icon name="check-circle" size={18} color={theme.colors.success} />
                  <CustomText variant="caption" color="muted">
                    tomou às {new Date(intake.dateISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </CustomText>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => onLogIntake(item)}
              testID={`${testID}-log`}
            >
              <Icon name="add-circle-outline" size={16} color={theme.colors.primary} />
              <CustomText variant="caption" style={styles.actionBtnText}>
                Registrar tomada
              </CustomText>
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              onPress={() => onViewHistory(item)}
              testID={`${testID}-history`}
            >
              <Icon name="history" size={16} color={theme.colors.primary} />
              <CustomText variant="caption" style={styles.actionBtnText}>
                Ver histórico
              </CustomText>
            </Pressable>
          </View>

          <View style={styles.iconActions}>
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
      )}
    </View>
  );
};

export default MedicationCard;
