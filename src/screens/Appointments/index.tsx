import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PersonStackParamList } from '@/types/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

type AppointmentsNavigationProp = NativeStackNavigationProp<PersonStackParamList, 'Appointments'>;
type AppointmentsRouteProp = RouteProp<PersonStackParamList, 'Appointments'>;

const AppointmentsScreen = () => {
  const navigation = useNavigation<AppointmentsNavigationProp>();
  const route = useRoute<AppointmentsRouteProp>();
  const { personId } = route.params;

  const {
    container,
    title,
    navButton,
    buttonText,
  } = styles;

  return (
    <View style={container}>
      <Text style={title}>Tela de Consultas Médicas</Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate('PersonDetail', { personId })}
        style={navButton}
      >
        <Icon name="arrow-back" size={20} color="#FFF" />
        <Text style={buttonText}>Voltar para Detalhes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.getParent()?.navigate('Home')}
        style={navButton}
      >
        <Icon name="home" size={20} color="#FFF" />
        <Text style={buttonText}>Ir para Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentsScreen;
