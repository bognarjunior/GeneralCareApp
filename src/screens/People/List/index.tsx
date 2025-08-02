import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import styles from './styles';

const PeopleListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { container, label } = styles;
  return (
    <View style={container}>
      <Text style={label}>Lista de Pessoas</Text>

      <Button title="Medicamentos" onPress={() => navigation.navigate('Medications')} />
      <Button title="Pressão Arterial" onPress={() => navigation.navigate('BloodPressure')} />
      <Button title="Glicemia" onPress={() => navigation.navigate('Glycemia')} />
      <Button title="Cadastrar Pessoa" onPress={() => navigation.navigate('PersonForm')} />
      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default PeopleListScreen;
