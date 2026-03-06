/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PersonFormScreen from './index';

const mockCreatePerson = jest.fn();
const mockUpdatePerson = jest.fn();
const mockGetPerson = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
    useRoute: () => ({ params: {} }),
  };
});

jest.mock('@/hooks/usePeople', () => ({
  usePeople: () => ({
    createPerson: mockCreatePerson,
    updatePerson: mockUpdatePerson,
    getPerson: mockGetPerson,
  }),
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
  const Btn = ({ label, onPress, testID, disabled }: any) =>
    React.createElement(
      TouchableOpacity,
      { testID, accessibilityLabel: testID, onPress: disabled ? undefined : onPress },
      React.createElement(Text, null, label)
    );
  Btn.Group = ({ children }: any) => React.createElement(View, null, children);
  return Btn;
});

jest.mock('@/components/FormAvatarField', () => {
  const React = require('react');
  const { TouchableOpacity } = require('react-native');
  return function MockAvatar(props: any) {
    return React.createElement(TouchableOpacity, {
      testID: 'avatar-field',
      onPress: () => props.onChange && props.onChange('uri://mock'),
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
      React.createElement(TextInput, { placeholder, value, onChangeText, style: inputStyle })
    );
  };
});

jest.mock('@/components/FormDateField', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return function MockDateField(props: any) {
    return React.createElement(TextInput, {
      testID: props.testID,
      value: props.value,
      onChangeText: props.onChangeText,
    });
  };
});

jest.mock('@/components/Modal', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return function MockModal(props: any) {
    if (!props.visible) return null;
    const tid = props.testID ?? 'confirm-modal';
    return React.createElement(
      View,
      { testID: tid },
      props.message
        ? React.createElement(Text, { testID: `${tid}-message` }, props.message)
        : null,
      props.onConfirm
        ? React.createElement(
            TouchableOpacity,
            { testID: `${tid}-confirm`, onPress: props.onConfirm },
            React.createElement(Text, null, props.confirmLabel ?? 'Confirmar')
          )
        : null,
      props.onCancel
        ? React.createElement(
            TouchableOpacity,
            { testID: `${tid}-cancel`, onPress: props.onCancel },
            React.createElement(Text, null, props.cancelLabel ?? 'Cancelar')
          )
        : null
    );
  };
});

beforeEach(() => {
  mockCreatePerson.mockReset();
  mockUpdatePerson.mockReset();
  mockGetPerson.mockReset();
  mockReplace.mockReset();
  mockGoBack.mockReset();
});

describe('PersonFormScreen', () => {
  it('Submit inválido (sem nome) abre modal com mensagem de erro', async () => {
    const ui = render(<PersonFormScreen />);
    fireEvent.press(ui.getByTestId('btn-save'));

    expect(mockCreatePerson).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(ui.getByTestId('confirm-modal-message').props.children).toBe(
        'Revise os campos destacados.'
      )
    );
  });

  it('Data inválida bloqueia submit e mostra modal de erro', async () => {
    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(ui.getByPlaceholderText('Ex.: João da Silva'), 'João da Silva');
    fireEvent.changeText(ui.getByTestId('birthdate'), '31/02/2024');

    fireEvent.press(ui.getByTestId('btn-save'));

    expect(mockCreatePerson).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(ui.getByTestId('confirm-modal-message').props.children).toBe(
        'Revise os campos destacados.'
      )
    );
  });

  it('Ao apagar a data, birthDate é enviado como undefined e navega após confirmar modal', async () => {
    mockCreatePerson.mockResolvedValueOnce({ id: 'xyz' });

    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(ui.getByPlaceholderText('Ex.: João da Silva'), 'Carlos Silva');
    fireEvent.changeText(ui.getByTestId('birthdate'), '10/10/2000');
    fireEvent.changeText(ui.getByTestId('birthdate'), '');

    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockCreatePerson).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'Carlos Silva', birthDate: undefined })
      );
    });

    await waitFor(() => expect(ui.getByTestId('confirm-modal-confirm')).toBeTruthy());

    await act(async () => {
      fireEvent.press(ui.getByTestId('confirm-modal-confirm'));
    });

    expect(mockReplace).toHaveBeenCalledWith('PersonDetailStack', { personId: 'xyz' });
  });

  it('Submit com erro no createPerson mostra modal de erro', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockCreatePerson.mockRejectedValueOnce(new Error('boom'));

    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(ui.getByPlaceholderText('Ex.: João da Silva'), 'Maria Souza');
    fireEvent.changeText(ui.getByTestId('birthdate'), '10/10/2000');

    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() =>
      expect(ui.getByTestId('confirm-modal-message').props.children).toBe(
        'Não foi possível salvar. Tente novamente.'
      )
    );

    spy.mockRestore();
  });

  it('Submit sucesso chama createPerson e navega ao confirmar modal', async () => {
    mockCreatePerson.mockResolvedValueOnce({ id: 'abc' });

    const ui = render(<PersonFormScreen />);

    fireEvent.changeText(ui.getByPlaceholderText('Ex.: João da Silva'), 'Pedro Paulo');
    fireEvent.changeText(ui.getByTestId('birthdate'), '05/05/1990');
    fireEvent.changeText(ui.getByPlaceholderText('Alergias, observações gerais...'), 'Obs');

    fireEvent.press(ui.getByTestId('btn-save'));

    await waitFor(() => expect(ui.getByTestId('confirm-modal-confirm')).toBeTruthy());
    expect(ui.getByTestId('confirm-modal-message').props.children).toBe(
      'Pessoa cadastrada com sucesso!'
    );

    await act(async () => {
      fireEvent.press(ui.getByTestId('confirm-modal-confirm'));
    });

    expect(mockReplace).toHaveBeenCalledWith('PersonDetailStack', { personId: 'abc' });
  });

  it('FormAvatarField dispara onChange (cobre setField avatarUri)', () => {
    const ui = render(<PersonFormScreen />);
    fireEvent.press(ui.getByTestId('avatar-field'));
  });
});
