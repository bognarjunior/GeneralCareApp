import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import FormSheet from './index';

describe('FormSheet', () => {
  it('não renderiza conteúdo quando visible=false', () => {
    const { queryByTestId } = render(
      <FormSheet visible={false} onClose={jest.fn()}>
        <Text>Conteúdo</Text>
      </FormSheet>,
    );
    expect(queryByTestId('form-sheet')).toBeNull();
  });

  it('renderiza conteúdo quando visible=true', () => {
    const { getByTestId, getByText } = render(
      <FormSheet visible onClose={jest.fn()}>
        <Text>Conteúdo</Text>
      </FormSheet>,
    );
    expect(getByTestId('form-sheet')).toBeTruthy();
    expect(getByText('Conteúdo')).toBeTruthy();
  });

  it('exibe título quando fornecido', () => {
    const { getByText } = render(
      <FormSheet visible onClose={jest.fn()} title="Novo Registro">
        <Text>Campo</Text>
      </FormSheet>,
    );
    expect(getByText('Novo Registro')).toBeTruthy();
  });

  it('não exibe título quando não fornecido', () => {
    const { queryByText } = render(
      <FormSheet visible onClose={jest.fn()}>
        <Text>Campo</Text>
      </FormSheet>,
    );
    expect(queryByText('Novo Registro')).toBeNull();
  });

  it('chama onClose ao pressionar o overlay', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <FormSheet visible onClose={onClose}>
        <Text>Campo</Text>
      </FormSheet>,
    );
    fireEvent.press(getByTestId('form-sheet-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('respeita testID customizado', () => {
    const { getByTestId } = render(
      <FormSheet visible onClose={jest.fn()} testID="meu-sheet">
        <Text>Campo</Text>
      </FormSheet>,
    );
    expect(getByTestId('meu-sheet')).toBeTruthy();
    expect(getByTestId('meu-sheet-overlay')).toBeTruthy();
  });

  it('renderiza children dentro do sheet', () => {
    const { getByText } = render(
      <FormSheet visible onClose={jest.fn()}>
        <Text testID="child-a">Campo A</Text>
        <Text testID="child-b">Campo B</Text>
      </FormSheet>,
    );
    expect(getByText('Campo A')).toBeTruthy();
    expect(getByText('Campo B')).toBeTruthy();
  });
});
