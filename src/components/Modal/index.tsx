import React from 'react';
import { Modal as RNModal, View, Platform } from 'react-native';
import styles from './styles';
import type { ModalProps } from '@/types/components/Modal';
import CustomText from '@/components/CustomText';
import Button from '@/components/Button';

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
  cancelDestructive = false,
  loading = false,
  testID = 'confirm-modal',
}) => {
  const hasCancel = !!onCancel;
  const hasConfirm = !!onConfirm;
  const singleButton = hasConfirm && !hasCancel;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={Platform.OS === 'android'}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay} testID={`${testID}-overlay`}>
        <View style={styles.card} testID={testID}>
          {!!title && (
            <CustomText
              variant="title"
              weight="bold"
              style={styles.title}
              testID={`${testID}-title`}
            >
              {title}
            </CustomText>
          )}

          {!!message && (
            <CustomText
              variant="body"
              color="textSecondary"
              style={styles.message}
              testID={`${testID}-message`}
            >
              {message}
            </CustomText>
          )}

          <View style={styles.actions}>
            {hasCancel && (
              <Button
                label={cancelLabel}
                onPress={onCancel}
                disabled={loading}
                variant={cancelDestructive ? 'danger' : 'primary'}
                testID={`${testID}-cancel`}
                style={!singleButton ? styles.actionButton : undefined}
              />
            )}

            {hasConfirm && (
              <Button
                label={confirmLabel}
                variant={destructive ? 'danger' : 'primary'}
                onPress={onConfirm}
                disabled={loading}
                testID={`${testID}-confirm`}
                style={singleButton ? styles.actionButtonFull : styles.actionButton}
              />
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
