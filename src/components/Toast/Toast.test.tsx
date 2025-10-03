/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { Animated, View } from 'react-native';
import { render, act } from '@testing-library/react-native';
import Toast from './index';
import theme from '@/theme';

jest.mock('@/components/CustomText', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCustomText(props: any) {
    return React.createElement(Text, props, props.children);
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 20, left: 0, right: 0 }),
}));

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const getStyleArray = (el: any) =>
  Array.isArray(el.props.style) ? el.props.style.flat() : [el.props.style];

const findInStyle = (styles: any[], key: string) =>
  styles.find((s) => s && typeof s === 'object' && key in s)?.[key];

describe('Toast', () => {
  it('não renderiza quando visible=false', () => {
    const { queryByTestId } = render(<Toast visible={false} message="Oi" />);
    expect(queryByTestId('toast')).toBeNull();
  });

  it('renderiza quando visible=true (variant=info) e aplica posição top com insets+offset', () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <Toast visible message="Info!" variant="info" position="top" offset={5} />
    );

    const node = getByTestId('toast');
    const styles = getStyleArray(node);

    expect(findInStyle(styles, 'backgroundColor')).toBe(theme.colors.infoLight);
    expect(findInStyle(styles, 'borderColor')).toBe(theme.colors.info);

    const wrappers = UNSAFE_queryAllByType(View).filter(
      (v: any) => v.props?.pointerEvents === 'none'
    );
    expect(wrappers.length).toBeGreaterThan(0);
    const wrapper = wrappers[0];
    const wstyles = getStyleArray(wrapper);
    expect(findInStyle(wstyles, 'top')).toBe(10 + 5);
  });

  it('aplica cores para success e error (rerender)', () => {
    const { getByTestId, rerender } = render(
      <Toast visible message="sucesso" variant="success" />
    );
    let styles = getStyleArray(getByTestId('toast'));
    expect(findInStyle(styles, 'backgroundColor')).toBe(theme.colors.successLight);
    expect(findInStyle(styles, 'borderColor')).toBe(theme.colors.success);

    rerender(<Toast visible message="erro" variant="error" />);
    styles = getStyleArray(getByTestId('toast'));
    expect(findInStyle(styles, 'backgroundColor')).toBe(theme.colors.dangerLight);
    expect(findInStyle(styles, 'borderColor')).toBe(theme.colors.danger);
  });

  it('posição bottom usa bottom inset + offset', () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <Toast visible message="Bottom" position="bottom" offset={7} />
    );
    expect(getByTestId('toast')).toBeTruthy();

    const wrappers = UNSAFE_queryAllByType(View).filter(
      (v: any) => v.props?.pointerEvents === 'none'
    );
    expect(wrappers.length).toBeGreaterThan(0);

    const wrapper = wrappers[0];
    const wstyles = getStyleArray(wrapper);
    expect(findInStyle(wstyles, 'bottom')).toBe(20 + 7);
  });


  it('chama onHide após duration (auto-hide) e aceita style extra', () => {
    const onHide = jest.fn();
    const timingSpy = jest
      .spyOn(Animated, 'timing')
      .mockImplementation((_value: any, _config: any) => {
        return {
          start: (cb?: (res?: any) => void) => {
            cb && cb();
          },
          stop: jest.fn(),
        } as any;
      });

    const { getByTestId } = render(
      <Toast
        visible
        message="Auto hide"
        duration={1000}
        onHide={onHide}
        style={{ borderRadius: 99 }}
      />
    );

    const styles = getStyleArray(getByTestId('toast'));
    expect(findInStyle(styles, 'borderRadius')).toBe(99);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(timingSpy).toHaveBeenCalled();
  });

  it('ao mudar para visible=false remove o nó (null)', () => {
    const { queryByTestId, rerender } = render(<Toast visible message="x" />);
    expect(queryByTestId('toast')).toBeTruthy();

    rerender(<Toast visible={false} message="x" />);
    expect(queryByTestId('toast')).toBeNull();
  });
});
