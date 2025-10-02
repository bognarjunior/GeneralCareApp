import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import styles from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;

const PeopleListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { container, label } = styles;

  const personId = '123';

  return (
    <View style={container}>
      <Text style={label}>Lista de Pessoas</Text>

      <Button
        title="Ver Detalhes de João"
        onPress={() => navigation.navigate('PersonDetailStack', { personId })}
      />

      <Button
        title="Cadastrar Pessoa"
        onPress={() => navigation.navigate('PeopleRegister')}
      />

      <Button
        title="Voltar para Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default PeopleListScreen;
