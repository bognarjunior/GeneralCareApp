import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation/';
import styles from './styles';
const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {container, label} = styles;

  return (
    <View style={container}>
      <Text style={label}>Home Screen</Text>
      <Button title="Lista de Pessoas" onPress={() => navigation.navigate('PeopleList')} />
      <Button title="Cadastrar Pessoa" onPress={() => navigation.navigate('PeopleRegister')} />
    </View>
  );
};

export default HomeScreen;

