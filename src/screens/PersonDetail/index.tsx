import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PersonDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { container, icon, title, info, backButton, backText } = styles;
  return (
    <View style={container}>
      <Icon name="person" size={64} color="#333" style={icon} />
      
      <Text style={title}>Detalhes da Pessoa</Text>
      <Text style={info}>Nome: João da Silva</Text>

      <Button title="Medicamentos" onPress={() => navigation.navigate('Medications')} />
      <Button title="Pressão Arterial" onPress={() => navigation.navigate('BloodPressure')} />
      <Button title="Glicemia" onPress={() => navigation.navigate('Glycemia')} />

      <TouchableOpacity onPress={() => navigation.navigate('PeopleList')} style={backButton}>
        <Icon name="arrow-back" size={20} color="#FFF" />
        <Text style={backText}>Voltar para Lista</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonDetailScreen;
