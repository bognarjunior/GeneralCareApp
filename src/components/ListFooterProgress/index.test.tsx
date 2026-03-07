import React from 'react';
import { render } from '@testing-library/react-native';
import ListFooterProgress from './index';

describe('ListFooterProgress', () => {
  it('renderiza spacer quando hasMore=false', () => {
    const { getByTestId, queryByTestId } = render(<ListFooterProgress hasMore={false} />);
    expect(getByTestId('list-footer-progress-spacer')).toBeTruthy();
    expect(queryByTestId('list-footer-progress-loading')).toBeNull();
  });

  it('renderiza loader quando hasMore=true', () => {
    const { getByTestId, queryByTestId } = render(<ListFooterProgress hasMore={true} />);
    expect(getByTestId('list-footer-progress-loading')).toBeTruthy();
    expect(queryByTestId('list-footer-progress-spacer')).toBeNull();
  });

  it('usa testID customizado', () => {
    const { getByTestId } = render(<ListFooterProgress hasMore={false} testID="custom-footer" />);
    expect(getByTestId('custom-footer-spacer')).toBeTruthy();
  });

  it('usa testID customizado com loader', () => {
    const { getByTestId } = render(<ListFooterProgress hasMore={true} testID="my-footer" />);
    expect(getByTestId('my-footer-loading')).toBeTruthy();
  });
});
