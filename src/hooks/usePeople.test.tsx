import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { PeopleProvider } from '@/context/PeopleContext';
import { usePeople } from '@/hooks/usePeople';

jest.mock('@/repositories/peopleRepository', () => ({
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
}));

describe('usePeople (re-export)', () => {
  it('lança erro quando usado fora do PeopleProvider', () => {
    const Outside: React.FC = () => {
      usePeople();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      'usePeople must be used within a PeopleProvider'
    );
  });

  it('funciona dentro do PeopleProvider e expõe o estado (people.length)', async () => {
    const Probe: React.FC = () => {
      const { people } = usePeople();
      return <Text testID="len">{people.length}</Text>;
    };

    const ui = render(
      <PeopleProvider>
        <Probe />
      </PeopleProvider>
    );

    await waitFor(() =>
      expect(ui.getByTestId('len').props.children).toBe(0)
    );
  });
});
