import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IconButton from '@/components/IconButton';

describe('IconButton', () => {
  it('renderiza o label corretamente', () => {
    const { getByText } = render(
      <IconButton iconName="add" label="Adicionar" onPress={jest.fn()} />
    );
    expect(getByText('Adicionar')).toBeTruthy();
  });

  it('renderiza o ícone corretamente', () => {
    const { getByTestId } = render(
      <IconButton iconName="add" label="Adicionar" onPress={jest.fn()} />
    );
    const icon = getByTestId('icon-button-icon');
    expect(icon).toBeTruthy();
  });

  it('executa o onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <IconButton iconName="add" label="Adicionar" onPress={onPressMock} />
    );
    const button = getByTestId('icon-button');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });
});
