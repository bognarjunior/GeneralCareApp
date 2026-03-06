import React from 'react';
import { Dimensions, Modal, Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomText from '@/components/CustomText';
import theme from '@/theme';
import styles from './styles';

export interface FormSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  testID?: string;
  children: React.ReactNode;
}

const FormSheet: React.FC<FormSheetProps> = ({
  visible,
  onClose,
  title,
  testID = 'form-sheet',
  children,
}) => {
  const insets = useSafeAreaInsets();
  const maxSheetHeight = Dimensions.get('window').height - insets.top - theme.spacing.lg;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable style={styles.dismiss} onPress={onClose} testID={`${testID}-overlay`} />

        <SafeAreaView
          edges={['bottom']}
          style={[styles.sheet, { height: maxSheetHeight }]}
          testID={testID}
        >
          <View style={styles.grabberWrap}>
            <View style={styles.grabber} />
          </View>

          {title ? (
            <View style={styles.header}>
              <CustomText variant="subtitle" weight="bold">
                {title}
              </CustomText>
            </View>
          ) : null}

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default FormSheet;
