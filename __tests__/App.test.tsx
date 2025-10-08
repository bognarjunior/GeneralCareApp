import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from '../src/App';

jest.mock('@/repositories/peopleRepository', () => ({
  list: jest.fn().mockResolvedValue([]),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
}));

const flush = () => new Promise<void>(resolve => setImmediate(resolve));

describe('App', () => {
  it('mounts without crashing (sem warnings de act)', async () => {
    render(<App />);
    await act(async () => {
      await flush();
    });
  });
});
