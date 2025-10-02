import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Card from './index';
import Icon from 'react-native-vector-icons/MaterialIcons';

describe('Card component', () => {
  it('renderiza título, descrição, ícone e ícone à direita', () => {
    const { getByText, getByTestId } = render(
      <Card
        icon={<Icon name="person" size={24} color="blue" testID="card-icon" />}
        title="Título do Card"
        description="Descrição aqui"
        rightIcon={<Icon name="chevron-right" size={24} color="gray" testID="right-icon" />}
      />
    );

    expect(getByText('Título do Card')).toBeTruthy();
    expect(getByText('Descrição aqui')).toBeTruthy();
    expect(getByTestId('card-icon')).toBeTruthy();
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('executa onPress quando clicado', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Card
        icon={<Icon name="person" size={24} color="blue" testID="card-icon" />}
        title="Clique Aqui"
        onPress={onPress}
        rightIcon={<Icon name="chevron-right" size={24} color="gray" testID="right-icon" />}
      />
    );
    const touchable = getByTestId('card-touchable');
    fireEvent.press(touchable);
    expect(onPress).toHaveBeenCalled();
  });

  it('renderiza corretamente sem descrição e sem rightIcon', () => {
    const { getByText, queryByTestId } = render(
      <Card
        icon={<Icon name="person" size={24} color="blue" testID="card-icon" />}
        title="Sem descrição"
      />
    );
    expect(getByText('Sem descrição')).toBeTruthy();
    expect(queryByTestId('right-icon')).toBeNull();
  });
});
