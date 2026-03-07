import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { personId: 'p1' } }),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const mockHook = jest.fn();
jest.mock('@/hooks/useGlycemia', () => ({
  useGlycemia: (...args: unknown[]) => mockHook(...args),
}));

jest.mock('./components/FormSheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ visible }: { visible: boolean }) =>
    visible ? React.createElement(View, { testID: 'form-sheet' }) : null;
});

import GlycemiaScreen from './index';
import type { Glycemia } from '@/repositories/glycemiaRepository';

const baseHook = {
  items: [] as Glycemia[],
  loading: false,
  refresh: jest.fn(),
  remove: jest.fn(),
  filter: 'all' as const,
  setFilter: jest.fn(),
  loadMore: jest.fn(),
  hasMore: false,
};

describe('GlycemiaScreen', () => {
  beforeEach(() => {
    mockHook.mockReturnValue(baseHook);
  });

  it('renderiza o header com título "Glicemia"', () => {
    const { getByText } = render(<GlycemiaScreen />);
    expect(getByText('Glicemia')).toBeTruthy();
  });

  it('exibe estado vazio quando não há itens', () => {
    const { getByText } = render(<GlycemiaScreen />);
    expect(getByText('Nada encontrado neste período.')).toBeTruthy();
  });

  it('exibe loader quando loading=true e lista vazia', () => {
    mockHook.mockReturnValue({ ...baseHook, loading: true });
    const { UNSAFE_getByType } = render(<GlycemiaScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar o botão de adicionar', () => {
    const { getByTestId } = render(<GlycemiaScreen />);
    fireEvent.press(getByTestId('gly-open-create'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('abre o FormSheet ao pressionar "Adicionar" no estado vazio', () => {
    const { getByTestId } = render(<GlycemiaScreen />);
    fireEvent.press(getByTestId('gly-empty-add'));
    expect(getByTestId('form-sheet')).toBeTruthy();
  });

  it('chama useGlycemia com o personId correto', () => {
    render(<GlycemiaScreen />);
    expect(mockHook).toHaveBeenCalledWith('p1');
  });
});
