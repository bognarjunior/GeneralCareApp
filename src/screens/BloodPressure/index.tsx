import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import styles from './styles';
const BloodPressureScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { container, label } = styles;
  return (
    <View style={container}>
      <Text style={label}>Blood Pressure Screen</Text>
      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default BloodPressureScreen;


