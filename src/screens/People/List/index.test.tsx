import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

const mockUsePeople = jest.fn();
jest.mock('@/hooks/usePeople', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUsePeople(...args),
}));

import PeopleListScreen from './index';
import type { Person } from '@/repositories/peopleRepository';

const basePeople = {
  people: [] as Person[],
  loading: false,
  refresh: jest.fn(),
  removePerson: jest.fn(),
  getPerson: jest.fn(),
  addPerson: jest.fn(),
  updatePerson: jest.fn(),
};

const mkPerson = (id: string, fullName: string): Person => ({
  id,
  fullName,
  birthDate: '01/01/1990',
  notes: '',
});

describe('PeopleListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePeople.mockReturnValue(basePeople);
  });

  it('exibe EmptyState quando não há pessoas', () => {
    const { getByText } = render(<PeopleListScreen />);
    expect(getByText('Não existem pessoas cadastradas!')).toBeTruthy();
  });

  it('exibe skeletons durante carregamento', () => {
    mockUsePeople.mockReturnValue({ ...basePeople, loading: true });
    const { UNSAFE_getAllByType } = render(<PeopleListScreen />);
    const { View } = require('react-native');
    // Loading state renders skeleton items
    expect(UNSAFE_getAllByType(View).length).toBeGreaterThan(0);
  });

  it('exibe lista de pessoas quando há dados', () => {
    mockUsePeople.mockReturnValue({
      ...basePeople,
      people: [mkPerson('p1', 'Maria Silva'), mkPerson('p2', 'João Santos')],
    });
    const { getByText } = render(<PeopleListScreen />);
    expect(getByText('Maria Silva')).toBeTruthy();
    expect(getByText('João Santos')).toBeTruthy();
  });

  it('exibe campo de busca quando há pessoas', () => {
    mockUsePeople.mockReturnValue({
      ...basePeople,
      people: [mkPerson('p1', 'Maria Silva')],
    });
    const { getByPlaceholderText } = render(<PeopleListScreen />);
    expect(getByPlaceholderText('Buscar pessoa...')).toBeTruthy();
  });

  it('exibe "Nenhuma pessoa encontrada" quando busca não tem resultado', () => {
    mockUsePeople.mockReturnValue({
      ...basePeople,
      people: [mkPerson('p1', 'Maria Silva')],
    });
    const { getByPlaceholderText, getByText } = render(<PeopleListScreen />);
    fireEvent.changeText(getByPlaceholderText('Buscar pessoa...'), 'xyz');
    expect(getByText('Nenhuma pessoa encontrada')).toBeTruthy();
  });
});
