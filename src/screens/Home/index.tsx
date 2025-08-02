import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Home Screen</Text>
      <Button title="Ir para Medicamentos" onPress={() => navigation.navigate('Medications')} />
      <Button title="Ir para Pressão Arterial" onPress={() => navigation.navigate('BloodPressure')} />
      <Button title="Ir para Glicemia" onPress={() => navigation.navigate('Glycemia')} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#333333',
    fontSize: 18,
  },
});
