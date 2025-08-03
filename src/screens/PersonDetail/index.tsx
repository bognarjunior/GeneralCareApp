import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PersonDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    container,
    icon,
    title,
    info,
    navButton,
    navButtonText,
    navIcon,
    navGroup,
  } = styles;

  return (
    <View style={container}>
      <Icon name="person" size={64} color="#333" style={icon} />
      
      <Text style={title}>Detalhes da Pessoa</Text>
      <Text style={info}>Nome: João da Silva</Text>

      <View style={navGroup}>
        <TouchableOpacity onPress={() => navigation.navigate('Medications')} style={navButton}>
          <Icon name="medication" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Medicamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('BloodPressure')} style={navButton}>
          <Icon name="monitor-heart" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Pressão Arterial</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Glycemia')} style={navButton}>
          <Icon name="bloodtype" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Glicemia</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Measurements')} style={navButton}>
          <Icon name="straighten" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Medidas (Peso / Altura)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Appointments')} style={navButton}>
          <Icon name="event-note" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Consultas Médicas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Charts')} style={navButton}>
          <Icon name="insert-chart" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Gráficos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PeopleList')} style={navButton}>
          <Icon name="arrow-back" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Voltar para Lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonDetailScreen;
