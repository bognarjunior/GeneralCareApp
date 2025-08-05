import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import CustomText from '@/components/CustomText';
import CustomImage from '@/components/CustomImage';
import Card from '@/components/Card'; // O Card componentizado
import theme from '@/theme';

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

        <View style={styles.cardsArea}>
          <Card
            icon={<Icon name="person-add-alt" size={theme.fonts.size.xl} color={theme.colors.primary} />}
            title="Cadastro de Usuário"
            description="Gerencie informações pessoais e saúde"
            onPress={() => navigation.navigate('PeopleRegister')}
            rightIcon={<Icon name="chevron-right" size={24} color={theme.colors.muted} />}
          />
          <Card
            icon={<Icon name="groups" size={theme.fonts.size.xl} color={theme.colors.primary} />}
            title="Listar Pessoas"
            description="Veja todas as pessoas cadastradas"
            onPress={() => navigation.navigate('PeopleList')}
            rightIcon={<Icon name="chevron-right" size={24} color={theme.colors.muted} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
