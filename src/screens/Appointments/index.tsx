import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const AppointmentsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Consultas Médicas</Text>

      <TouchableOpacity onPress={() => navigation.navigate('PersonDetail')} style={styles.navButton}>
        <Icon name="arrow-back" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Voltar para Detalhes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
        <Icon name="home" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Ir para Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentsScreen;
