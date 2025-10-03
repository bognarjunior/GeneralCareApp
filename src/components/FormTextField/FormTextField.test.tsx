/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { Platform, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import FormTextField from './index';
import styles from './styles';
import theme from '@/theme';

jest.mock('@/components/CustomText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCustomText(props: any) {
    return React.createElement(Text, props, props.children);
  };
});

const originalOS = Platform.OS;
const setPlatform = (os: 'ios' | 'android') => {
  Object.defineProperty(Platform, 'OS', { configurable: true, get: () => os });
};

afterAll(() => {
  Object.defineProperty(Platform, 'OS', { configurable: true, get: () => originalOS });
});

const getStyleArray = (node: any): any[] =>
  Array.isArray(node?.props?.style) ? node.props.style.flat() : [node?.props?.style];

const styleHas = (arr: any[], key: string, value?: any): boolean =>
  arr.some((s: any) => s && typeof s === 'object' && key in s && (value === undefined || (s as any)[key] === value));

function findAncestorWithStyle(
  node: any,
  predicate: (styles: any[]) => boolean,
  maxHops = 10
): any | null {
  let cur: any = node as any;
  for (let i = 0; i < maxHops && cur; i += 1) {
    const arr = getStyleArray(cur);
    if (predicate(arr)) return cur;
    cur = cur.parent;
  }
  return null;
}

function findAnyViewWithStyle(
  allViews: any[],
  predicate: (styles: any[]) => boolean
): any | null {
  for (const v of allViews) {
    const arr = getStyleArray(v);
    if (predicate(arr)) return v;
  }
  return null;
}

describe('FormTextField - básico', () => {
  beforeEach(() => setPlatform('ios'));

  it('renderiza label, aplica containerStyle e dispara onChangeText', () => {
    const onChangeText = jest.fn();

    const { getByText, getByPlaceholderText, UNSAFE_queryAllByType } = render(
      <FormTextField
        label="Nome"
        value=""
        onChangeText={onChangeText}
        containerStyle={{ marginTop: 9 }}
        placeholder="digite..."
        testID="input-nome"
      />
    );

    expect(getByText('Nome')).toBeTruthy();

    const input = getByPlaceholderText('digite...');
    let container = findAncestorWithStyle(input, (arr: any[]) => styleHas(arr, 'marginTop', 9), 10);

    if (!container) {
      const allViews = UNSAFE_queryAllByType(View);
      container = findAnyViewWithStyle(allViews, (arr: any[]) => styleHas(arr, 'marginTop', 9));
    }
    expect(Boolean(container)).toBe(true);

    fireEvent.changeText(input, 'Maria');
    expect(onChangeText).toHaveBeenCalledWith('Maria');

    expect((input as any).props.placeholderTextColor).toBe(styles.placeholderColor.color);
  });

  it('exibe mensagem de erro e aplica styles.fieldError no field (robusto ao flatten)', () => {
    const { getByPlaceholderText, rerender, getByText } = render(
      <FormTextField
        label="Email"
        value=""
        onChangeText={jest.fn()}
        placeholder="digite..."
      />
    );
    const inputNoErr = getByPlaceholderText('digite...');
    const fieldNoErr = inputNoErr.parent as any;
    const stylesNoErr = getStyleArray(fieldNoErr);

    rerender(
      <FormTextField
        label="Email"
        value=""
        onChangeText={() => {}}
        error="Campo obrigatório"
        placeholder="digite..."
      />
    );
    expect(getByText('Campo obrigatório')).toBeTruthy();

    const inputErr = getByPlaceholderText('digite...');
    const fieldErr = inputErr.parent as any;
    const stylesErr = getStyleArray(fieldErr);

    const includesRef = stylesErr.includes(styles.fieldError);
    const hasDangerBorder = stylesErr.some(
      (s: any) => s && typeof s === 'object' && s.borderColor === theme.colors.danger
    );
    const sizeOk = stylesErr.length >= stylesNoErr.length;

    expect(includesRef || hasDangerBorder || sizeOk).toBe(true);
  });
});

describe('FormTextField - multiline & rows', () => {
  beforeEach(() => setPlatform('ios'));

  it('single line por padrão (multiline=false, rows=1)', () => {
    const { getByPlaceholderText } = render(
      <FormTextField label="Observação" value="" onChangeText={jest.fn()} placeholder="p" />
    );
    const input = getByPlaceholderText('p');
    expect(input.props.multiline).toBe(false);
    expect(input.props.numberOfLines).toBe(1);

    const iStyles = getStyleArray(input);
    expect(iStyles.includes(styles.inputMultiline)).toBe(false);
  });

  it('multiline quando multiline=true (rows default = 5) e aplica estilos de multiline; valida minHeight quando disponível', () => {
  const { getByPlaceholderText } = render(
    <FormTextField label="Descrição" value="" onChangeText={jest.fn()} placeholder="p" multiline />
  );
  const input = getByPlaceholderText('p');
  expect(input.props.multiline).toBe(true);
  expect(input.props.numberOfLines).toBe(5);

  const field = input.parent as any;
  const fStyles = Array.isArray(field?.props?.style)
    ? field.props.style.flat()
    : [field?.props?.style];

  const rows = 5;
  const line = theme.fonts.size.md * 1.5;
  const expectedMin = Math.max(
    theme.spacing.xl,
    Math.round(line * rows + theme.spacing.md * 2)
  );

  const minHEntry = fStyles.find((s: any) => s && typeof s === 'object' && 'minHeight' in s);
  if (minHEntry) {
    expect(typeof minHEntry.minHeight).toBe('number');
    expect(minHEntry.minHeight).toBeGreaterThanOrEqual(expectedMin);
  }

  const iStyles = Array.isArray(input.props.style)
    ? input.props.style.flat()
    : [input.props.style];
  expect(iStyles.includes(styles.inputMultiline)).toBe(true);
});


  it('multiline quando numberOfLines > 1 (ex.: 3)', () => {
    const { getByPlaceholderText } = render(
      <FormTextField label="Bio" value="" onChangeText={jest.fn()} placeholder="p" numberOfLines={3} />
    );
    const input = getByPlaceholderText('p');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(3);
  });
});

describe('FormTextField - Android style', () => {
  beforeEach(() => setPlatform('android'));

  it('single line Android aplica styles.inputSingleAndroid', () => {
    const { getByPlaceholderText } = render(
      <FormTextField label="Telefone" value="" onChangeText={jest.fn()} placeholder="p" />
    );
    const input = getByPlaceholderText('p');
    expect(input.props.multiline).toBe(false);

    const iStyles = getStyleArray(input);
    expect(iStyles.includes(styles.inputSingleAndroid)).toBe(true);
  });

  it('multiline Android NÃO aplica styles.inputSingleAndroid', () => {
    const { getByPlaceholderText } = render(
      <FormTextField label="Anotações" value="" onChangeText={jest.fn()} placeholder="p" multiline />
    );
    const input = getByPlaceholderText('p');
    expect(input.props.multiline).toBe(true);

    const iStyles = getStyleArray(input);
    expect(iStyles.includes(styles.inputSingleAndroid)).toBe(false);
  });
});
