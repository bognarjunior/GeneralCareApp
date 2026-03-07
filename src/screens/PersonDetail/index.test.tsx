import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack, popToTop: jest.fn() }),
}));

const mockGetPerson = jest.fn();
const mockRemovePerson = jest.fn();
jest.mock('@/hooks/usePeople', () => ({
  usePeople: () => ({ getPerson: mockGetPerson, removePerson: mockRemovePerson }),
}));

import PersonDetailScreen from './index';

const basePerson = {
  id: 'p1',
  fullName: 'João Silva',
  birthDate: '01/01/1990',
  notes: 'Hipertensão',
  avatarUri: undefined,
};

describe('PersonDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPerson.mockReturnValue(basePerson);
    mockRemovePerson.mockResolvedValue(undefined);
  });

  it('exibe o nome da pessoa', () => {
    const { getByText } = render(<PersonDetailScreen />);
    expect(getByText('João Silva')).toBeTruthy();
  });

  it('exibe as observações da pessoa', () => {
    const { getByText } = render(<PersonDetailScreen />);
    expect(getByText('Hipertensão')).toBeTruthy();
  });

  it('exibe as iniciais quando não há avatarUri', () => {
    const { getByText } = render(<PersonDetailScreen />);
    expect(getByText('JS')).toBeTruthy();
  });

  it('exibe mensagem padrão quando não há observações', () => {
    mockGetPerson.mockReturnValue({ ...basePerson, notes: '' });
    const { getByText } = render(<PersonDetailScreen />);
    expect(getByText('Não foi informado nenhuma.')).toBeTruthy();
  });

  it('navega para Dashboard ao pressionar o card do perfil', () => {
    const { getByText } = render(<PersonDetailScreen />);
    // The Pressable wraps the Surface with name
    fireEvent.press(getByText('João Silva'));
    expect(mockNavigate).toHaveBeenCalledWith('Dashboard', { personId: 'p1' });
  });

  it('exibe "—" quando a pessoa não é encontrada', () => {
    mockGetPerson.mockReturnValue(undefined);
    const { getByText } = render(<PersonDetailScreen />);
    expect(getByText('—')).toBeTruthy();
  });
});
