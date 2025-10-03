/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import Surface from './index';
import styles from './styles';
import theme from '@/theme';

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  return function MockLinearGradient(props: any) {
    return React.createElement('LinearGradient', props, props.children);
  };
});
import LinearGradientImport from 'react-native-linear-gradient';

const getStyleArray = (node: any): any[] =>
  Array.isArray(node?.props?.style) ? node.props.style.flat() : [node?.props?.style];

const styleHas = (arr: any[], key: string, value?: any): boolean =>
  arr.some((s: any) => s && typeof s === 'object' && key in s && (value === undefined || (s as any)[key] === value));

describe('Surface (sem gradient)', () => {
  it('renderiza com styles.card e padding pelo token md; renderiza children', () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <Surface padding="md">
        <View testID="child">
          <View />
        </View>
        <View>
          <View />
        </View>
      </Surface>
    );

    const root = UNSAFE_queryAllByType(View)[0];
    const rStyles = getStyleArray(root);

    expect(rStyles.includes(styles.card)).toBe(true);
    expect(styleHas(rStyles, 'padding', theme.spacing.md)).toBe(true);
    expect(getByTestId('child')).toBeTruthy();
  });

  it('aceita padding numérico', () => {
    const { UNSAFE_queryAllByType } = render(
      <Surface padding={24}>
        <View />
      </Surface>
    );
    const root = UNSAFE_queryAllByType(View)[0];
    const rStyles = getStyleArray(root);
    expect(styleHas(rStyles, 'padding', 24)).toBe(true);
  });
  
  it('usa padding default (lg) quando a prop não é fornecida', () => {
    const { UNSAFE_queryAllByType } = render(
      <Surface>
        <View />
      </Surface>
    );
    const root = UNSAFE_queryAllByType(View)[0];
    const rStyles = Array.isArray(root?.props?.style) ? root.props.style.flat() : [root?.props?.style];
    expect(rStyles.some((s: any) => s && s.padding === theme.spacing.lg)).toBe(true);
  });


  it('resolve padding para tokens sm/xl/lg (default) corretamente', () => {
    const cases: Array<{ pad: any; expected: number }> = [
      { pad: 'sm', expected: theme.spacing.sm },
      { pad: 'xl', expected: theme.spacing.xl },
      { pad: 'lg', expected: theme.spacing.lg },
    ];

    for (const { pad, expected } of cases) {
      const { UNSAFE_queryAllByType, unmount } = render(
        <Surface padding={pad}>
          <View />
        </Surface>
      );
      const root = UNSAFE_queryAllByType(View)[0];
      const rStyles = getStyleArray(root);
      expect(styleHas(rStyles, 'padding', expected)).toBe(true);
      unmount();
    }
  });
});

describe('Surface (com gradient)', () => {
  it('usa cores default do tema e start/end defaults; aplica estrutura e padding', () => {
    const { UNSAFE_queryAllByType } = render(
      <Surface gradient padding="sm">
        <View testID="inside" />
      </Surface>
    );

    const allViews = UNSAFE_queryAllByType(View);
    const outer = allViews[0];
    const outerStyles = getStyleArray(outer);
    expect(outerStyles.includes(styles.root)).toBe(true);
    expect(outerStyles.includes(styles.shadow)).toBe(true);

    const gradientBoxes = allViews.filter((v: any) => getStyleArray(v).includes(styles.gradientBox));
    expect(gradientBoxes.length).toBeGreaterThan(0);

    const gradients = UNSAFE_queryAllByType(LinearGradientImport);
    expect(gradients.length).toBe(1);
    const lg = gradients[0] as any;
    expect(lg.props.pointerEvents).toBe('none');
    expect(lg.props.colors).toEqual(theme.gradients.surface.soft);
    expect(lg.props.start).toEqual({ x: 0, y: 0 });
    expect(lg.props.end).toEqual({ x: 1, y: 1 });

    const contentViews = allViews.filter((v: any) => getStyleArray(v).includes(styles.content));
    expect(contentViews.length).toBe(1);
    const contentStyles = getStyleArray(contentViews[0]);
    expect(styleHas(contentStyles, 'padding', theme.spacing.sm)).toBe(true);
  });

  it('aceita gradientColors e start/end customizados; merge de style externo', () => {
    const custom = ['#111111', '#222222', '#333333'];
    const start = { x: 0.2, y: 0.3 };
    const end = { x: 0.9, y: 0.8 };

    const { UNSAFE_queryAllByType } = render(
      <Surface
        gradient
        gradientColors={custom}
        gradientStart={start}
        gradientEnd={end}
        padding="xl"
        style={{ marginTop: 7 }}
      >
        <View />
      </Surface>
    );

    const allViews = UNSAFE_queryAllByType(View);
    const outer = allViews[0];
    const outerStyles = getStyleArray(outer);
    expect(outerStyles.includes(styles.root)).toBe(true);
    expect(outerStyles.includes(styles.shadow)).toBe(true);
    expect(styleHas(outerStyles, 'marginTop', 7)).toBe(true);

    const gradients = UNSAFE_queryAllByType(LinearGradientImport);
    expect(gradients.length).toBe(1);
    const lg = gradients[0] as any;
    expect(lg.props.colors).toEqual(custom);
    expect(lg.props.start).toEqual(start);
    expect(lg.props.end).toEqual(end);

    const contentViews = allViews.filter((v: any) => getStyleArray(v).includes(styles.content));
    const contentStyles = getStyleArray(contentViews[0]);
    expect(styleHas(contentStyles, 'padding', theme.spacing.xl)).toBe(true);
  });
});
