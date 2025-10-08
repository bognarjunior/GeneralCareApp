/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PersonFormScreen from './index';

const mockCreatePerson = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  };
});

jest.mock('@/hooks/usePeople', () => ({
  usePeople: () => ({ createPerson: mockCreatePerson }),
}));

jest.mock('@/components/Container', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockContainer(props: any) {
    return React.createElement(View, { testID: 'container' }, props.children);
  };
});

jest.mock('@/components/Surface', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockSurface(props: any) {
    return React.createElement(View, { testID: 'surface' }, props.children);
  };
});

jest.mock('@/components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text, View } = require('react-native');
  const Btn = ({ label, onPress, testID }: any) =>
    React.createElement(
      TouchableOpacity,
      { testID, accessibilityLabel: testID, onPress },
      React.createElement(Text, null, label)
    );
  Btn.Group = ({ children }: any) => React.createElement(View, null, children);
  return Btn;
});

jest.mock('@/components/FormAvatarField', () => {
  const React = require('react');
  const { TouchableOpacity } = require('react-native');
  return function MockAvatar(props: any) {
    const { onChange } = props;
    return React.createElement(TouchableOpacity, {
      testID: 'avatar-field',
      onPress: () => onChange && onChange('uri://mock'),
    });
  };
});

jest.mock('@/components/FormTextField', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');
  return function MockTextField(props: any) {
    const { label, placeholder, value, onChangeText, inputStyle } = props;
    return React.createElement(
      View,
      null,
      label ? React.createElement(Text, null, label) : null,
      React.createElement(TextInput, {
        placeholder,
        value,
        onChangeText,
        style: inputStyle,
      })
    );
  };
});

jest.mock('@/components/FormDateField', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return function MockDateField(props: any) {
    const { value, onChangeText, testID } = props;
    return React.createElement(TextInput, { testID, value, onChangeText });
  };
});

jest.mock('@/components/Toast', () => {
  const React = require('react');
  const { Text } = require('react-native');
  let lastOnHide: (() => void) | undefined;
  const Toast = ({ visible, message, onHide }: any) => {
    lastOnHide = onHide;
    return visible ? React.createElement(Text, { testID: 'toast' }, message) : null;
  };
  return { __esModule: true, default: Toast, __getLastOnHide: () => lastOnHide };
});

const getToastHelpers = () => require('@/components/Toast');

beforeEach(() => {
  mockCreatePerson.mockReset();
  mockNavigate.mockReset();
  mockGoBack.mockReset();
});

describe('PersonFormScreen', () => {
  it('Submit inválido (sem nome) não chama createPerson e exibe toast de erro', async () => {
    const ui = render(<PersonFormScreen />);
    fireEvent.press(ui.getByTestId('btn-save'));

    expect(mockCreatePerson).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(ui.getByTestId('toast').props.children).toBe('Revise os campos destacados.')
    );
  });

  it('Data inválida bloqueia submit e mostra toast de erro', async () => {
    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(
      ui.getByPlaceholderText('Ex.: João da Silva'),
      'João da Silva'
    );
    fireEvent.changeText(ui.getByTestId('birthdate'), '31/02/2024');

    fireEvent.press(ui.getByTestId('btn-save'));

    expect(mockCreatePerson).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(ui.getByTestId('toast').props.children).toBe('Revise os campos destacados.')
    );
  });

  it('Ao apagar a data antes de salvar, birthDate é enviado como undefined', async () => {
    mockCreatePerson.mockResolvedValueOnce({ id: 'xyz' });

    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(ui.getByPlaceholderText('Ex.: João da Silva'), 'Carlos Silva');
    fireEvent.changeText(ui.getByTestId('birthdate'), '10/10/2000');
    fireEvent.changeText(ui.getByTestId('birthdate'), '');

    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockCreatePerson).toHaveBeenCalledTimes(1);
      expect(mockCreatePerson).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Carlos Silva',
          birthDate: undefined,
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('PersonDetailStack', { personId: 'xyz' });
    });
  });

  it('Submit com erro no createPerson cai no catch, loga erro e mostra toast de erro', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreatePerson.mockRejectedValueOnce(new Error('boom'));

    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(
      ui.getByPlaceholderText('Ex.: João da Silva'),
      'Maria Souza'
    );
    fireEvent.changeText(ui.getByTestId('birthdate'), '10/10/2000');

    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(ui.getByTestId('toast').props.children).toBe(
        'Não foi possível salvar. Tente novamente.'
      );
    });

    spy.mockRestore();
  });

  it('Toast onHide limpa o estado do toast (setToast(null))', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreatePerson.mockRejectedValueOnce(new Error('boom'));
    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(
      ui.getByPlaceholderText('Ex.: João da Silva'),
      'Ana Maria'
    );
    fireEvent.changeText(ui.getByTestId('birthdate'), '01/01/2001');
    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() => expect(ui.getByTestId('toast')).toBeTruthy());

    const { __getLastOnHide } = getToastHelpers();
    const onHide = __getLastOnHide();

    await act(async () => {
      onHide && onHide();
    });

    await waitFor(() => {
      expect(() => ui.getByTestId('toast')).toThrow();
    });
    spy.mockRestore();
  });


  it('Cancelar chama navigation.goBack', () => {
    const ui = render(<PersonFormScreen />);
    fireEvent.press(ui.getByTestId('btn-cancel'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('Submit sucesso chama createPerson, mostra toast de sucesso e navega', async () => {
    mockCreatePerson.mockResolvedValueOnce({ id: 'abc' });

    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(
      ui.getByPlaceholderText('Ex.: João da Silva'),
      'Pedro Paulo'
    );
    fireEvent.changeText(ui.getByTestId('birthdate'), '05/05/1990');
    fireEvent.changeText(
      ui.getByPlaceholderText('Alergias, observações gerais...'),
      'Obs'
    );

    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockCreatePerson).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('PersonDetailStack', { personId: 'abc' });
      expect(ui.getByTestId('toast').props.children).toBe('Pessoa cadastrada com sucesso!');
    });
  });

  it('FormAvatarField dispara onChange (cobre setField avatarUri)', () => {
    const ui = render(<PersonFormScreen />);
    fireEvent.press(ui.getByTestId('avatar-field'));
  });
});
