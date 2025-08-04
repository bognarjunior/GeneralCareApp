import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PersonStackParamList } from '@/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const MedicationsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PersonStackParamList>>();
  const route = useRoute();
  const { personId } = route.params as { personId: string };

  const {
    container,
    title,
    navButton,
    buttonText,
  } = styles;

  return (
    <View style={container}>
      <Text style={title}>Tela de Medicamentos</Text>

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

export default MedicationsScreen;
