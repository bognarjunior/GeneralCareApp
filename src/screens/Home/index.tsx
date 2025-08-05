import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import CustomText from '@/components/CustomText';
import CustomImage from '@/components/CustomImage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomText variant="display" weight="bold" style={styles.title}>
          Gerencie sua{' '}
          <CustomText variant="display" weight="bold" color="primary" style={styles.titleHighlight}>
            saúde
          </CustomText>{' '}
          com facilidade
        </CustomText>

        <CustomText variant="subtitle" color="muted" style={styles.subtitle}>
          Cuidar da saúde nunca foi tão simples.
        </CustomText>

        <CustomText variant="body" color="text" style={styles.description}>
          Cuidamos da saúde da sua família com você. Cadastre pessoas queridas e acompanhe remédios, pressão, glicemia e muito mais.
        </CustomText>

        <CustomImage
          source={require('../../assets/images/healthHero.jpg')}
          resizeMode="cover"
          radius="xl"
          shadow="lg"
          style={styles.heroImage}
        />

        {/* Cards */}
        <View style={styles.cardsArea}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PeopleRegister')}
          >
            <View style={styles.cardIconBox}>
              <Icon name="person-add-alt" size={36} color="#3B82F6" />
            </View>
            <View style={styles.cardTextBox}>
              <CustomText variant="title" weight="bold" style={styles.cardTitle}>
                Cadastro de Usuário
              </CustomText>
              <CustomText variant="body" color="muted" style={styles.cardDesc}>
                Gerencie informações pessoais e saúde
              </CustomText>
            </View>
            <Icon name="chevron-right" size={24} color="#B0B0B0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PeopleList')}
          >
            <View style={styles.cardIconBox}>
              <Icon name="groups" size={36} color="#3B82F6" />
            </View>
            <View style={styles.cardTextBox}>
              <CustomText variant="title" weight="bold" style={styles.cardTitle}>
                Listar Pessoas
              </CustomText>
              <CustomText variant="body" color="muted" style={styles.cardDesc}>
                Veja todas as pessoas cadastradas
              </CustomText>
            </View>
            <Icon name="chevron-right" size={24} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
