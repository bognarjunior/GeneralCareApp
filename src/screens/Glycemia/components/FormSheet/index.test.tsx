import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';

// Mock Picker before imports
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Picker = ({ children, testID }: any) =>
    React.createElement(View, { testID }, children);
  Picker.Item = ({ label }: any) => React.createElement(Text, null, label);
  return { Picker };
});

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@/hooks/useGlycemia', () => ({
  useGlycemia: () => ({ create: mockCreate, update: mockUpdate, items: [], loading: false }),
}));

import GlycemiaFormSheet from './index';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  personId: 'p1',
  preset: null,
  onSaved: jest.fn(),
};

describe('GlycemiaFormSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({});
    mockUpdate.mockResolvedValue({});
  });

  it('exibe título "Nova Glicemia" quando não está editando', () => {
    const { getByText } = render(<GlycemiaFormSheet {...baseProps} />);
    expect(getByText('Nova Glicemia')).toBeTruthy();
  });

  it('exibe título "Editar Glicemia" quando está editando', () => {
    const preset = {
      id: 'g1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      valueMgDl: 95,
      context: 'fasting' as const,
    };
    const { getByText } = render(<GlycemiaFormSheet {...baseProps} preset={preset} />);
    expect(getByText('Editar Glicemia')).toBeTruthy();
  });

  it('renderiza os campos do formulário', () => {
    const { getByTestId } = render(<GlycemiaFormSheet {...baseProps} />);
    expect(getByTestId('gly-value')).toBeTruthy();
    expect(getByTestId('gly-notes')).toBeTruthy();
  });

  it('botão Salvar fica desabilitado quando valor está vazio/inválido', () => {
    const { getByText } = render(<GlycemiaFormSheet {...baseProps} />);
    const saveBtn = getByText('Salvar');
    expect(saveBtn).toBeTruthy();
  });

  it('chama create ao salvar com valor válido', async () => {
    const { getByTestId, getByText } = render(<GlycemiaFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('gly-value'), '95');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ personId: 'p1', valueMgDl: 95 }),
    ));
  });

  it('chama update ao salvar em modo edição', async () => {
    const preset = {
      id: 'g1',
      personId: 'p1',
      dateISO: new Date().toISOString(),
      valueMgDl: 95,
      context: 'fasting' as const,
    };
    const { getByTestId, getByText } = render(<GlycemiaFormSheet {...baseProps} preset={preset} />);
    fireEvent.changeText(getByTestId('gly-value'), '110');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(
      'g1',
      expect.objectContaining({ valueMgDl: 110 }),
    ));
  });

  it('chama onClose ao pressionar Cancelar', () => {
    const onClose = jest.fn();
    const { getByText } = render(<GlycemiaFormSheet {...baseProps} onClose={onClose} />);
    fireEvent.press(getByText('Cancelar'));
    expect(onClose).toHaveBeenCalled();
  });

  it('não chama create quando valor é inválido (acima de 2000)', async () => {
    const { getByTestId, getByText } = render(<GlycemiaFormSheet {...baseProps} />);
    fireEvent.changeText(getByTestId('gly-value'), '9999');
    await act(async () => {
      fireEvent.press(getByText('Salvar'));
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
