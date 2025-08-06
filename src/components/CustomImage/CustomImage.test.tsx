import React from 'react';
import { render } from '@testing-library/react-native';
import CustomImage from './index';

const mockImage = { uri: 'https://via.placeholder.com/150' };

describe('CustomImage', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(
      <CustomImage source={mockImage} testID="custom-image" />
    );
    const image = getByTestId('custom-image');
    expect(image).toBeTruthy();
  });

  it('applies custom radius and shadow', () => {
    const { getByTestId } = render(
      <CustomImage
        source={mockImage}
        radius="xl"
        shadow="lg"
        testID="custom-image"
      />
    );
    const image = getByTestId('custom-image');
    expect(image.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: expect.any(Number) }),
        expect.any(Object),
        expect.any(Object), 
      ])
    );
  });
});
