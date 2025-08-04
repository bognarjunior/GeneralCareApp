import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, PersonStackParamList } from '@/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import styles from './styles';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<PersonStackParamList, 'PersonDetail'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type RouteProps = RouteProp<PersonStackParamList, 'PersonDetail'>;

const PersonDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { personId } = route.params;

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
      <Text style={info}>ID: {personId}</Text>

      <View style={navGroup}>
        <TouchableOpacity onPress={() => navigation.navigate('Medications', { personId })} style={navButton}>
          <Icon name="medication" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Medicamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('BloodPressure', { personId })} style={navButton}>
          <Icon name="monitor-heart" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Pressão Arterial</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Glycemia', { personId })} style={navButton}>
          <Icon name="bloodtype" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Glicemia</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Measurements', { personId })} style={navButton}>
          <Icon name="straighten" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Medidas (Peso / Altura)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Appointments', { personId })} style={navButton}>
          <Icon name="event-note" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Consultas Médicas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Charts', { personId })} style={navButton}>
          <Icon name="insert-chart" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Gráficos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PeopleList')} style={navButton}>
          <Icon name="arrow-back" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Voltar para Lista</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={navButton}>
          <Icon name="home" size={20} style={navIcon} color="#FFF" />
          <Text style={navButtonText}>Voltar para Início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonDetailScreen;
