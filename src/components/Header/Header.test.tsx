/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from './index';

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: (props: any) => React.createElement(View, props, props.children),
  };
});

jest.mock('@/components/IconButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return function MockIconButton(props: any) {
    const { onPress } = props;
    return React.createElement(
      TouchableOpacity,
      { testID: 'icon-button', onPress },
      React.createElement(Text, null, 'back')
    );
  };
});

describe('Header', () => {
  it('renderiza o título e não mostra o botão de voltar por padrão', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <Header title="GeneralApp" testID="app-header" />
    );

    expect(getByTestId('app-header')).toBeTruthy();
    expect(getByText('GeneralApp')).toBeTruthy();
    expect(queryByTestId('icon-button')).toBeNull();
  });

  it('mostra o botão de voltar quando showBack=true e dispara onBackPress', () => {
    const onBack = jest.fn();

    const { getByTestId } = render(
      <Header title="GeneralApp" showBack onBackPress={onBack} />
    );

    const back = getByTestId('icon-button');
    fireEvent.press(back);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('aceita titleVariant customizado (renderização básica)', () => {
    const { getByText } = render(
      <Header title="GeneralApp" titleVariant="title" />
    );
    expect(getByText('GeneralApp')).toBeTruthy();
  });

  it('usa no-op quando showBack=true e onBackPress não é passado', () => {
    const { getByTestId } = render(
      <Header title="GeneralApp" showBack />
    );
    fireEvent.press(getByTestId('icon-button'));
  });
});
