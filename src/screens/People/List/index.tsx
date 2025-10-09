import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import styles from './styles';
import EmptyState from '@/components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;

const PeopleListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { container } = styles;

  return (
    <View style={container}>
      <EmptyState
        message="Não existem pessoas cadastradas!"
        intro="Comece a utilizar o app e tenha ferramentas completas para o gerenciamento inteligente da sua saúde."
        action={{
          title: 'Cadastro de Usuário',
          description: 'Gerencie informações pessoais e saúde',
          onPress: () => navigation.navigate('PeopleRegister'),
          iconName: 'person-add-alt',
        }}
      />
    </View>
  );
};

export default PeopleListScreen;
