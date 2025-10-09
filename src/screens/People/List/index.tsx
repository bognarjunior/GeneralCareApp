import React, { useMemo, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import styles from './styles';

import usePeople from '@/hooks/usePeople';
import EmptyState from '@/components/EmptyState';
import PersonListItem from '@/components/PersonListItem';
import FormTextField from '@/components/FormTextField';
import theme from '@/theme';
import { getAgeLabel } from '@/utils/formatters/person';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;

const PeopleListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { container, content, searchBox, listArea, spacer } = styles;

  const { people, loading, refresh } = usePeople();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter(p => p.fullName.toLowerCase().includes(q));
  }, [people, query]);

  const showEmpty = !loading && people.length === 0 && query.trim().length === 0;
  const showNoMatch = !loading && people.length > 0 && filtered.length === 0;

  return (
    <View style={container}>
      <View style={searchBox}>
        <FormTextField
          placeholder="Buscar pessoa..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          containerStyle={styles.search}
        />
      </View>
      {showEmpty ? (
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
      ) : showNoMatch ? (
        <EmptyState
          message="Nenhuma pessoa encontrada"
          intro="Tente ajustar sua busca."
          action={undefined}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[content, listArea]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.surface}
            />
          }
        >
          {filtered.map((p, idx) => (
            <PersonListItem
              key={p.id}
              fullName={p.fullName}
              ageLabel={getAgeLabel(p.birthDate)}
              avatarUri={p.avatarUri}
              onPress={() => navigation.navigate('PersonDetailStack', { personId: p.id })}
              style={idx < filtered.length - 1 ? styles.itemSpacing : undefined}
            />
          ))}
          <View style={spacer} />
        </ScrollView>
      )}
    </View>
  );
};

export default PeopleListScreen;
