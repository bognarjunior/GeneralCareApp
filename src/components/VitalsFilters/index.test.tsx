import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import VitalsFilters from './index';

describe('VitalsFilters', () => {
  it('renderiza os filtros padrão', () => {
    const { getByText } = render(
      <VitalsFilters value="all" onChange={jest.fn()} />,
    );
    expect(getByText('Hoje')).toBeTruthy();
    expect(getByText('7 dias')).toBeTruthy();
    expect(getByText('30 dias')).toBeTruthy();
    expect(getByText('90 dias')).toBeTruthy();
  });

  it('chama onChange com o valor do filtro pressionado', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <VitalsFilters value="all" onChange={onChange} />,
    );
    fireEvent.press(getByText('7 dias'));
    expect(onChange).toHaveBeenCalledWith('7d');
  });

  it('chama onChange com "all" ao pressionar filtro já selecionado', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <VitalsFilters value="7d" onChange={onChange} />,
    );
    fireEvent.press(getByText('7 dias'));
    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('chama onChange com o valor correto para "Hoje"', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <VitalsFilters value="all" onChange={onChange} />,
    );
    fireEvent.press(getByText('Hoje'));
    expect(onChange).toHaveBeenCalledWith('today');
  });

  it('renderiza com scrollable=false (View em vez de ScrollView)', () => {
    const { getByTestId } = render(
      <VitalsFilters value="all" onChange={jest.fn()} scrollable={false} testID="vf-test" />,
    );
    expect(getByTestId('vf-test')).toBeTruthy();
  });

  it('aceita opções customizadas', () => {
    const options = [
      { label: 'Opção A', value: 'a' as const },
      { label: 'Opção B', value: 'b' as const },
    ];
    const onChange = jest.fn();
    const { getByText } = render(
      <VitalsFilters value="all" onChange={onChange} options={options as never} />,
    );
    expect(getByText('Opção A')).toBeTruthy();
    expect(getByText('Opção B')).toBeTruthy();
    fireEvent.press(getByText('Opção A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
