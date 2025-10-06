/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import {
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import FormDateField from './index';

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

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  function MockDateTimePicker(props: any) {
    return React.createElement('DateTimePicker', props, null);
  }
  MockDateTimePicker.displayName = 'MockDateTimePicker';
  return MockDateTimePicker;
});
import DateTimePicker from '@react-native-community/datetimepicker';

const originalOS = Platform.OS;
const setPlatform = (os: 'ios' | 'android') => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
};

afterAll(() => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => originalOS,
  });
});

describe('FormDateField (Android)', () => {
  beforeEach(() => setPlatform('android'));

  it('renderiza label e placeholder quando sem valor', () => {
    const { getByText } = render(
      <FormDateField label="Data de Nascimento" value={undefined} onChangeText={jest.fn()} />
    );
    expect(getByText('Data de Nascimento')).toBeTruthy();
    expect(getByText('DD/MM/AAAA')).toBeTruthy();
  });

  it('abre o DateTimePicker ao tocar e passa min/max/value; dismiss não chama onChangeText', async () => {
    const onChangeText = jest.fn();
    const min = new Date(1980, 0, 1);
    const max = new Date(2030, 11, 31);

    const { getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField
        value={undefined}
        onChangeText={onChangeText}
        minDate={min}
        maxDate={max}
        testID="date-android"
      />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-android'));
    });

    const pickers = UNSAFE_queryAllByType(DateTimePicker as any);
    expect(pickers.length).toBe(1);
    const picker = pickers[0] as any;

    expect(picker.props.value instanceof Date).toBe(true);
    expect(picker.props.value.getFullYear()).toBe(1990);
    expect(picker.props.value.getMonth()).toBe(0);
    expect(picker.props.value.getDate()).toBe(1);

    expect(picker.props.minimumDate).toEqual(min);
    expect(picker.props.maximumDate).toEqual(max);

    await act(async () => {
      picker.props.onChange({ type: 'dismissed' }, undefined);
    });
    expect(onChangeText).not.toHaveBeenCalled();
  });

  it('seleciona uma data e chama onChangeText com DD/MM/AAAA; fecha o picker (Android fecha após change)', async () => {
    const onChangeText = jest.fn();
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField value={undefined} onChangeText={onChangeText} testID="date-android" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-android'));
    });
    let pickers = UNSAFE_queryAllByType(DateTimePicker as any);
    expect(pickers.length).toBe(1);

    const newDate = new Date(2020, 4, 15);
    await act(async () => {
      (pickers[0] as any).props.onChange({ type: 'set' }, newDate);
    });

    expect(onChangeText).toHaveBeenCalledWith('15/05/2020');

    pickers = UNSAFE_queryAllByType(DateTimePicker as any);
    expect(pickers.length).toBe(0);
  });

  it('não abre quando disabled e mostra valor atual ou placeholder', async () => {
    const { getByTestId, UNSAFE_queryAllByType, getByText, rerender } = render(
      <FormDateField value={undefined} onChangeText={jest.fn()} disabled testID="date-android" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-android'));
    });
    expect(UNSAFE_queryAllByType(DateTimePicker as any).length).toBe(0);
    expect(getByText('DD/MM/AAAA')).toBeTruthy();

    rerender(<FormDateField value="01/01/2000" disabled onChangeText={jest.fn()} testID="date-android" />);
    expect(getByText('01/01/2000')).toBeTruthy();
  });

  it('exibe mensagem de erro quando error é fornecido', () => {
    const { getByText } = render(
      <FormDateField value={undefined} onChangeText={jest.fn()} error="Campo obrigatório" />
    );
    expect(getByText('Campo obrigatório')).toBeTruthy();
  });
});

describe('FormDateField (iOS)', () => {
  beforeEach(() => setPlatform('ios'));

  it('abre Modal ao tocar; onChange chama onChangeText; botões fecham', async () => {
    const onChangeText = jest.fn();
    const { getByText, getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField value={undefined} onChangeText={onChangeText} testID="date-ios" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-ios'));
    });
    let pickers = UNSAFE_queryAllByType(DateTimePicker as any);
    expect(pickers.length).toBe(1);

    const date = new Date(2024, 0, 2);
    await act(async () => {
      (pickers[0] as any).props.onChange({ type: 'set' }, date);
    });
    expect(onChangeText).toHaveBeenCalledWith('02/01/2024');

    await act(async () => {
      fireEvent.press(getByText('Cancelar'));
    });
    pickers = UNSAFE_queryAllByType(DateTimePicker as any);
    expect(pickers.length).toBe(0);

    await act(async () => {
      fireEvent.press(getByTestId('date-ios'));
    });
    expect(UNSAFE_queryAllByType(DateTimePicker as any).length).toBe(1);

    await act(async () => {
      fireEvent.press(getByText('OK'));
    });
    expect(UNSAFE_queryAllByType(DateTimePicker as any).length).toBe(0);
  });

  it('respeita minDate/maxDate no iOS', async () => {
    const min = new Date(2010, 0, 1);
    const max = new Date(2025, 11, 31);

    const { getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField value="10/10/2012" onChangeText={jest.fn()} minDate={min} maxDate={max} testID="date-ios" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-ios'));
    });
    const picker = UNSAFE_queryAllByType(DateTimePicker as any)[0] as any;

    expect(picker.props.minimumDate).toEqual(min);
    expect(picker.props.maximumDate).toEqual(max);
    expect(picker.props.value instanceof Date).toBe(true);
    expect(picker.props.value.getFullYear()).toBe(2012);
    expect(picker.props.value.getMonth()).toBe(9);
    expect(picker.props.value.getDate()).toBe(10);
  });

  it('disabled no iOS não deve abrir o Modal', async () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField value={undefined} onChangeText={jest.fn()} disabled testID="date-ios" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-ios'));
    });
    expect(UNSAFE_queryAllByType(DateTimePicker as any).length).toBe(0);
  });

  it('fecha ao tocar no backdrop (Pressable) do Modal no iOS', async () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField label="Data" value="01/01/2020" onChangeText={jest.fn()} testID="date-ios" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-ios'));
    });

    const pressables = UNSAFE_queryAllByType(Pressable as any);
    expect(pressables.length).toBeGreaterThan(0);

    await act(async () => {
      pressables[0].props.onPress();
    });

    expect(UNSAFE_queryAllByType(DateTimePicker as any).length).toBe(0);
  });

  it('fecha quando onRequestClose do Modal é disparado (iOS)', async () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <FormDateField label="Data" value="01/01/2020" onChangeText={jest.fn()} testID="date-ios" />
    );

    await act(async () => {
      fireEvent.press(getByTestId('date-ios'));
    });

    const modals = UNSAFE_queryAllByType(Modal as any);
    expect(modals.length).toBeGreaterThan(0);

    await act(async () => {
      modals[0].props.onRequestClose();
    });

    expect(UNSAFE_queryAllByType(DateTimePicker as any).length).toBe(0);
  });
});
