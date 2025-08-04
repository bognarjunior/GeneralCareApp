import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation, CompositeNavigationProp, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, PersonStackParamList } from '@/types/navigation';
import type { RouteProp } from '@react-navigation/native';
import styles from './styles';
import IconButton from '@/components/IconButton';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<PersonStackParamList, 'PersonDetail'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type RouteProps = RouteProp<PersonStackParamList, 'PersonDetail'>;

const PersonDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { personId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Pessoa</Text>
      <Text style={styles.info}>ID: {personId}</Text>

      <View style={styles.navGroup}>
        <IconButton
          iconName="medication"
          label="Medicamentos"
          onPress={() => navigation.navigate('Medications', { personId })}
        />
        <IconButton
          iconName="monitor-heart"
          label="Pressão Arterial"
          onPress={() => navigation.navigate('BloodPressure', { personId })}
        />
        <IconButton
          iconName="bloodtype"
          label="Glicemia"
          onPress={() => navigation.navigate('Glycemia', { personId })}
        />
        <IconButton
          iconName="straighten"
          label="Medidas (Peso / Altura)"
          onPress={() => navigation.navigate('Measurements', { personId })}
        />
        <IconButton
          iconName="event-note"
          label="Consultas Médicas"
          onPress={() => navigation.navigate('Appointments', { personId })}
        />
        <IconButton
          iconName="insert-chart"
          label="Gráficos"
          onPress={() => navigation.navigate('Charts', { personId })}
        />
        <IconButton
          iconName="arrow-back"
          label="Voltar para Lista"
          onPress={() => navigation.navigate('PeopleList')}
        />
        <IconButton
          iconName="home"
          label="Voltar para Início"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

export default PersonDetailScreen;
