/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';
import FormAvatarField from './index';

jest.mock('@/components/CustomText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCustomText(props: any) {
    return React.createElement(Text, props, props.children);
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const React = require('react');
  return function MockIcon(props: any) {
    return React.createElement('Icon', props, null);
  };
});

const mockLaunch = jest.fn();
jest.mock('react-native-image-picker', () => {
  return { launchImageLibrary: (...args: any[]) => (global as any).__mockLaunch(...args) };
});

beforeAll(() => {
  (global as any).__mockLaunch = mockLaunch;
});
afterEach(() => {
  mockLaunch.mockReset();
});

describe('FormAvatarField', () => {
  it('renderiza o label quando fornecido e aplica containerStyle', () => {
    const { getByText, getByTestId } = render(
      <FormAvatarField
        label="Foto do Paciente"
        value={undefined}
        onChange={jest.fn()}
        containerStyle={{ marginTop: 7 }}
      />
    );

    expect(getByText('Foto do Paciente')).toBeTruthy();

    const container = getByTestId('avatar-field');
    const flat = Array.isArray(container.props.style) ? container.props.style.flat() : [container.props.style];
    expect(flat.some((s) => s && s.marginTop === 7)).toBe(true);
  });

  it('estado vazio: cancela e depois seleciona uma imagem (chama onChange com uri)', async () => {
    const onChange = jest.fn();

    mockLaunch.mockResolvedValueOnce({ didCancel: true });

    const { getByLabelText, findByLabelText } = render(
      <FormAvatarField label="Foto" value={undefined} onChange={onChange} />
    );

    const btnSelect = getByLabelText('Selecionar foto');
    fireEvent.press(btnSelect);
    expect(mockLaunch).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    mockLaunch.mockResolvedValueOnce({
      didCancel: false,
      assets: [{ uri: 'file:///avatar.jpg' }],
    });

    const btnSelectAgain = await findByLabelText('Selecionar foto');
    fireEvent.press(btnSelectAgain);

    expect(mockLaunch).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('file:///avatar.jpg'));
  });

  it('estado com imagem: renderiza botão de alterar e aciona picker', async () => {
    mockLaunch.mockResolvedValueOnce({ didCancel: true }); // só exercitar fluxo

    const onChange = jest.fn();
    const { getByTestId, getByLabelText } = render(
      <FormAvatarField label="Foto" value="file:///foto.png" onChange={onChange} />
    );

    expect(getByTestId('avatar-change')).toBeTruthy();

    const btnChange = getByLabelText('Alterar foto');
    fireEvent.press(btnChange);
    expect(mockLaunch).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('quando picker retorna sem uri, onChange não é chamado', async () => {
    const onChange = jest.fn();
    mockLaunch.mockResolvedValueOnce({
      didCancel: false,
      assets: [{}],
    });

    const { getByLabelText } = render(
      <FormAvatarField value={undefined} onChange={onChange} />
    );

    fireEvent.press(getByLabelText('Selecionar foto'));
    expect(mockLaunch).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('disabled=true: bloquear interação em ambos os estados', () => {
    const onChange = jest.fn();

    const { getByLabelText, rerender } = render(
      <FormAvatarField value={undefined} onChange={onChange} disabled />
    );
    const btnSelect = getByLabelText('Selecionar foto');
    fireEvent.press(btnSelect);
    expect(mockLaunch).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();

    rerender(<FormAvatarField value="file:///foto.png" onChange={onChange} disabled />);
    const btnChange = getByLabelText('Alterar foto');
    fireEvent.press(btnChange);
    expect(mockLaunch).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('pickImage (estado vazio) retorna imediatamente quando disabled=true', async () => {
    const onChange = jest.fn();
    const { UNSAFE_queryAllByType } = render(
      <FormAvatarField value={undefined} onChange={onChange} disabled />
    );

    const touch = UNSAFE_queryAllByType(TouchableOpacity)[0];
    expect(touch).toBeTruthy();

    await Promise.resolve(touch.props.onPress?.());

    expect((global as any).__mockLaunch).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('pickImage (com imagem) retorna imediatamente quando disabled=true', async () => {
    const onChange = jest.fn();
    const { UNSAFE_queryAllByType } = render(
      <FormAvatarField value="file:///foto.png" onChange={onChange} disabled />
    );

    const touchables = UNSAFE_queryAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);
    const fab = touchables[touchables.length - 1];

    await Promise.resolve(fab.props.onPress?.());

    expect((global as any).__mockLaunch).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
