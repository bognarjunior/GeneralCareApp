import React, { useMemo, useRef, useState, createRef } from 'react';
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
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import IconButton from '@/components/IconButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;

const PeopleListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { container, content, searchBox, listArea, spacer } = styles;

  const { people, loading, refresh, removePerson } = usePeople();
  const [query, setQuery] = useState('');

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  const rowRefs = useRef(
    new Map<string, React.RefObject<SwipeableMethods | null>>()
  );

  const getRowRef = (id: string): React.RefObject<SwipeableMethods | null> => {
    let ref = rowRefs.current.get(id);
    if (!ref) {
      ref = createRef<SwipeableMethods | null>();
      rowRefs.current.set(id, ref);
    }
    return ref;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter(p => p.fullName.toLowerCase().includes(q));
  }, [people, query]);

  const showEmpty = !loading && people.length === 0 && query.trim().length === 0;
  const showNoMatch = !loading && people.length > 0 && filtered.length === 0;

  function openConfirm(id: string, name: string) {
    rowRefs.current.get(id)?.current?.close?.();
    setTargetId(id);
    setTargetName(name);
    setConfirmVisible(true);
  }

  async function handleConfirmDelete() {
    if (!targetId) return;
    try {
      setDeleting(true);
      await removePerson(targetId);
      setConfirmVisible(false);
    } finally {
      setDeleting(false);
      setTargetId(null);
      setTargetName('');
    }
  }

  const renderRightActions = (id: string, name: string) => (
    <View style={styles.rightActions}>
      <View style={[styles.deleteBtn]} testID={`delete-${id}`}>
        <IconButton
          iconName="delete"
          onPress={() => openConfirm(id, name)}
          backgroundColor="transparent"
          iconColor={theme.colors.white}
          textColor={theme.colors.white}
          iconSize={theme.sizes.icon.md}
        />
      </View>
    </View>
  );

  return (
    <View style={container}>
      {people.length > 0 && (
        <View style={searchBox}>
          <FormTextField
            placeholder="Buscar pessoa..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            containerStyle={styles.search}
          />
        </View>
      )}

      {loading && people.length === 0 ? (
        <ScrollView contentContainerStyle={[content, listArea]} showsVerticalScrollIndicator={false}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={`sk-${i}`} style={i < 7 ? styles.itemSpacing : undefined}>
              <Skeleton height={72} />
            </View>
          ))}
          <View style={spacer} />
        </ScrollView>
      ) : showEmpty ? (
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
        <EmptyState message="Nenhuma pessoa encontrada" intro="Tente ajustar sua busca." action={undefined} />
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
            <View key={p.id} style={idx < filtered.length ? styles.itemSpacing : undefined}>
              <Swipeable
                ref={getRowRef(p.id)}
                overshootRight={false}
                renderRightActions={() => renderRightActions(p.id, p.fullName)}
              >
                <PersonListItem
                  fullName={p.fullName}
                  ageLabel={getAgeLabel(p.birthDate)}
                  avatarUri={p.avatarUri}
                  onPress={() => navigation.navigate('PersonDetailStack', { personId: p.id })}
                />
              </Swipeable>
            </View>
          ))}
          <View style={spacer} />
        </ScrollView>
      )}

      <Modal
        visible={confirmVisible}
        title="Excluir pessoa"
        message={`Tem certeza que deseja excluir "${targetName}"? Essa ação não poderá ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmVisible(false)}
        destructive
        loading={deleting}
        testID="delete-confirm-modal"
      />
    </View>
  );
};

export default PeopleListScreen;
