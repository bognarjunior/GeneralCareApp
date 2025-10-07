import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './index';
import theme from '@/theme';
import { TouchableOpacity } from 'react-native';

jest.mock('@/components/CustomText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCustomText(props: any) {
    return React.createElement(Text, props, props.children);
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  return function MockLinearGradient(props: any) {
    return React.createElement('LinearGradient', props, props.children);
  };
});
import LinearGradientImport from 'react-native-linear-gradient';

const getTextColor = (style: any) => {
  const arr = Array.isArray(style) ? style.flat() : [style];
  const withColor = arr.filter((s) => s && typeof s === 'object' && 'color' in s);
  return withColor.length ? withColor[withColor.length - 1].color : undefined;
};

describe('Button', () => {
  it('renderiza label e dispara onPress quando habilitado', () => {
    const onPress = jest.fn();
    const { getByText, UNSAFE_queryAllByType } = render(
      <Button label="Salvar" onPress={onPress} />
    );
    expect(getByText('Salvar')).toBeTruthy();

    const touch = UNSAFE_queryAllByType(TouchableOpacity)[0];
    fireEvent.press(touch);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não dispara onPress quando disabled (valida prop disabled)', () => {
    const onPress = jest.fn();
    const { UNSAFE_queryAllByType } = render(
      <Button label="Desabilitado" disabled onPress={onPress} />
    );
    const touch = UNSAFE_queryAllByType(TouchableOpacity)[0];

    expect(touch.props.disabled).toBe(true);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('aplica cor de texto por variant (sem gradient)', () => {
    const { getByText, rerender } = render(<Button label="A" variant="primary" />);
    expect(getTextColor(getByText('A').props.style)).toBe(theme.colors.white);

    rerender(<Button label="B" variant="secondary" />);
    expect(getTextColor(getByText('B').props.style)).toBe(theme.colors.white);

    rerender(<Button label="C" variant="danger" />);
    expect(getTextColor(getByText('C').props.style)).toBe(theme.colors.white);

    rerender(<Button label="D" variant="ghost" />);
    expect(getTextColor(getByText('D').props.style)).toBe(theme.colors.text);
  });

  it('exibe/oculta gradient conforme regras', () => {
    const { UNSAFE_queryAllByType, rerender } = render(
      <Button label="G" variant="primary" gradient />
    );
    expect(UNSAFE_queryAllByType(LinearGradientImport).length).toBe(1);

    rerender(<Button label="G" variant="ghost" gradient />);
    expect(UNSAFE_queryAllByType(LinearGradientImport).length).toBe(0);

    rerender(<Button label="G" variant="primary" gradient disabled />);
    expect(UNSAFE_queryAllByType(LinearGradientImport).length).toBe(0);
  });

  it('usa gradientColors, gradientStart e gradientEnd quando informados', () => {
    const custom = ['#111111', '#222222'];
    const start = { x: 0.25, y: 0.75 };
    const end = { x: 0.9, y: 0.1 };

    const { UNSAFE_queryAllByType } = render(
      <Button
        label="G"
        variant="primary"
        gradient
        gradientColors={custom}
        gradientStart={start}
        gradientEnd={end}
      />
    );
    const node = UNSAFE_queryAllByType(LinearGradientImport)[0];
    expect(node.props.colors).toEqual(custom);
    expect(node.props.start).toEqual(start);
    expect(node.props.end).toEqual(end);
  });

  it('define TouchableOpacity com activeOpacity 0.8', () => {
    const { UNSAFE_queryAllByType } = render(<Button label="A" />);
    const touch = UNSAFE_queryAllByType(TouchableOpacity)[0];
    expect(touch.props.activeOpacity).toBe(0.8);
  });
});

describe('Button.Group', () => {
  it('gap numérico em row: primeiro com marginRight=8, último = 0', () => {
    const { getByTestId } = render(
      <Button.Group gap={8} direction="row">
        <Button label="1" testID="g1" />
        <Button label="2" testID="g2" />
      </Button.Group>
    );

    const s1 = (getByTestId('g1') as any).props.style;
    const s2 = (getByTestId('g2') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    const flat2 = Array.isArray(s2) ? s2.flat() : [s2];

    expect(flat1.some((st) => st && st.marginRight === 8)).toBe(true);
    expect(flat2.some((st) => st && st.marginRight === 0)).toBe(true);
  });

  it('gap token em column: primeiro marginBottom=theme.spacing.md, último = 0', () => {
    const expected = theme.spacing.md;
    const { getByTestId } = render(
      <Button.Group gap="md" direction="column">
        <Button label="1" testID="c1" />
        <Button label="2" testID="c2" />
      </Button.Group>
    );

    const s1 = (getByTestId('c1') as any).props.style;
    const s2 = (getByTestId('c2') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    const flat2 = Array.isArray(s2) ? s2.flat() : [s2];

    expect(flat1.some((st) => st && st.marginBottom === expected)).toBe(true);
    expect(flat2.some((st) => st && st.marginBottom === 0)).toBe(true);
  });

  it('gap default 12 quando token é inválido', () => {
    const { getByTestId } = render(
      // @ts-expect-error
      <Button.Group gap="__invalido__">
        <Button label="1" testID="d1" />
        <Button label="2" testID="d2" />
      </Button.Group>
    );

    const s1 = (getByTestId('d1') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    expect(flat1.some((st) => st && st.marginRight === 12)).toBe(true);
  });

  it('ignora children falsy (último recebe margem 0)', () => {
    const { getByTestId } = render(
      <Button.Group gap={10}>
        {null}
        <Button label="1" testID="e1" />
        {false}
        <Button label="2" testID="e2" />
      </Button.Group>
    );

    const s1 = (getByTestId('e1') as any).props.style;
    const s2 = (getByTestId('e2') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    const flat2 = Array.isArray(s2) ? s2.flat() : [s2];

    expect(flat1.some((st) => st && st.marginRight === 10)).toBe(true);
    expect(flat2.some((st) => st && st.marginRight === 0)).toBe(true);
  });

  it('equal=true aplica branch (mantém itens presentes)', () => {
    const { getByTestId } = render(
      <Button.Group gap={6} equal>
        <Button label="1" testID="f1" />
        <Button label="2" testID="f2" />
      </Button.Group>
    );
    expect(getByTestId('f1')).toBeTruthy();
    expect(getByTestId('f2')).toBeTruthy();
  });
  
  it('Button.Group processa child não-elemento sem estilizar e aplica margem no elemento adjacente', () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <Button.Group gap={8} direction="row">
        {'Texto cru'}
        <Button label="OK" testID="ok" />
      </Button.Group>
    );

    const touches = UNSAFE_queryAllByType(TouchableOpacity);
    expect(touches.length).toBe(1);

    const sOk = (getByTestId('ok') as any).props.style;
    const flatOk = Array.isArray(sOk) ? sOk.flat() : [sOk];
    expect(flatOk.some((st) => st && st.marginRight === 0)).toBe(true);
  });

  it('Button.Group usa 12 quando gap é falsy (string vazia)', () => {
    const { getByTestId } = render(
      // @ts-expect-error
      <Button.Group gap="">
        <Button label="A" testID="z1" />
        <Button label="B" testID="z2" />
      </Button.Group>
    );

    const s1 = (getByTestId('z1') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    expect(flat1.some((st) => st && st.marginRight === 12)).toBe(true);
  });

  it('Button.Group (column) usa 12 quando spacing[token] é undefined', () => {
    const { getByTestId } = render(
      // @ts-expect-error
      <Button.Group gap="__token_inexistente__" direction="column">
        <Button label="A" testID="col1" />
        <Button label="B" testID="col2" />
      </Button.Group>
    );

    const s1 = (getByTestId('col1') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    expect(flat1.some((st) => st && st.marginBottom === 12)).toBe(true);

    const s2 = (getByTestId('col2') as any).props.style;
    const flat2 = Array.isArray(s2) ? s2.flat() : [s2];
    expect(flat2.some((st) => st && st.marginBottom === 0)).toBe(true);
  });

  it('usa defaults de gradientStart/end quando não informados (gradient ativo)', () => {
    const { UNSAFE_queryAllByType } = render(
      <Button label="Grad" variant="primary" gradient />
    );
    const node = UNSAFE_queryAllByType(require('react-native-linear-gradient')).at(0);
    expect(node?.props.start).toEqual({ x: 0, y: 0 });
    expect(node?.props.end).toEqual({ x: 1, y: 0 });
  });

  it('Button.Group usa default gap=12 quando a prop gap é omitida', () => {
    const { getByTestId } = render(
      <Button.Group>
        <Button label="A" testID="def1" />
        <Button label="B" testID="def2" />
      </Button.Group>
    );

    const s1 = (getByTestId('def1') as any).props.style;
    const s2 = (getByTestId('def2') as any).props.style;
    const flat1 = Array.isArray(s1) ? s1.flat() : [s1];
    const flat2 = Array.isArray(s2) ? s2.flat() : [s2];

    expect(flat1.some((st) => st && st.marginRight === 12)).toBe(true);
    expect(flat2.some((st) => st && st.marginRight === 0)).toBe(true);
  });
});
