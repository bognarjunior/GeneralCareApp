import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '@/components/CustomText';
import styles from './styles';
import theme from '@/theme';
import type { ActionSheetProps } from '@/types/components/ActionSheet';

const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  actions,
  onClose,
  title,
  testID = 'action-sheet',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent 
    >
      <Pressable style={styles.overlay} onPress={onClose} testID={`${testID}-overlay`}>
        <Pressable onPress={() => {}} testID={testID} style={styles.container}>
          <SafeAreaView edges={['bottom']} style={styles.sheet}>
            <View style={styles.grabberWrap}>
              <View style={styles.grabber} />
            </View>

            {title ? (
              <View style={styles.header}>
                {typeof title === 'string' ? (
                  <CustomText variant="subtitle" weight="bold" style={styles.titleText}>
                    {title}
                  </CustomText>
                ) : (
                  title
                )}
              </View>
            ) : null}

            <View style={styles.list}>
              {actions.map((a, idx) => (
                <React.Fragment key={`${a.label}-${idx}`}>
                  <Pressable
                    onPress={() => {
                      onClose();
                      setTimeout(a.onPress, 10);
                    }}
                    style={styles.item}
                    android_ripple={{ color: theme.colors.surface }}
                  >
                    {!!a.iconName && (
                      <Icon
                        name={a.iconName}
                        size={theme.sizes.icon.md}
                        color={a.tint === 'danger' ? theme.colors.danger : theme.colors.text}
                      />
                    )}
                    <CustomText
                      style={styles.itemLabel}
                      color={a.tint === 'danger' ? 'danger' : 'text'}
                    >
                      {a.label}
                    </CustomText>
                  </Pressable>
                  {idx < actions.length - 1 ? <View style={styles.divider} /> : null}
                </React.Fragment>
              ))}
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ActionSheet;
