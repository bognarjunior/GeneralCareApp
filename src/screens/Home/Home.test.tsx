import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '.';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('HomeScreen', () => {
  it('renderiza o título principal corretamente', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    expect(getByText(/Gerencie sua saúde com facilidade/i)).toBeTruthy();
  });

  it('renderiza os cards de navegação', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );
    expect(getByText(/Cadastro de Usuário/i)).toBeTruthy();
    expect(getByText(/Listar Pessoas/i)).toBeTruthy();
  });

  it('chama a navegação ao tocar nos cards', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText(/Cadastro de Usuário/i));
    fireEvent.press(getByText(/Listar Pessoas/i));
    expect(mockNavigate).toHaveBeenCalledWith('PeopleRegister');
    expect(mockNavigate).toHaveBeenCalledWith('PeopleList');
  });

  it('bater snapshot', () => {
    const tree = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
