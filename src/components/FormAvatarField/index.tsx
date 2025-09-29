import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import theme from '@/theme';
import type { FormAvatarFieldProps } from '@/types/components/FormAvatarField';
import CustomText from '@/components/CustomText';

const FormAvatarField: React.FC<FormAvatarFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
  testID = 'avatar-field',
  containerStyle,
}) => {
  async function pickImage() {
    if (disabled) return;
    const res = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
      quality: 0.9,
    });

    if (res.didCancel) return;
    const uri = res.assets?.[0]?.uri;
    if (uri) onChange(uri);
  }

  const hasImage = !!value;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {!!label && (
        <CustomText variant="caption" color="text" style={styles.label}>
          {label}
        </CustomText>
      )}

     {!hasImage ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pickImage}
          disabled={disabled}
          style={[styles.avatarBase, styles.avatarEmpty, disabled && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel="Selecionar foto"
        >
          <Icon name="photo-camera" size={24} color={theme.colors.muted} />
        </TouchableOpacity>
      ) : (
        <View style={[styles.avatarBase, disabled && styles.disabled]}>
          <Image source={{ uri: value }} style={styles.avatarImage} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImage}
            disabled={disabled}
            style={styles.cameraFab}
            accessibilityRole="button"
            accessibilityLabel="Alterar foto"
            testID="avatar-change"
          >
            <Icon name="photo-camera" size={16} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FormAvatarField;
