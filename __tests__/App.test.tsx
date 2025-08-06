import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

describe('App', () => {
  it('mounts without crashing', () => {
    render(
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    );
  });
});
