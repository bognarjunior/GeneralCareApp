import React from 'react';
import { render } from '@testing-library/react-native';
import CustomText from './index'; 

describe('CustomText', () => {
  it('renderiza o texto passado', () => {
    const { getByText } = render(<CustomText>Olá mundo</CustomText>);
    expect(getByText('Olá mundo')).toBeTruthy();
  });

  it('aplica o variant e o weight corretos', () => {
    const { getByText } = render(
      <CustomText variant="title" weight="bold">
        Teste Variant
      </CustomText>
    );
    const text = getByText('Teste Variant');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: expect.any(Number),
          fontFamily: expect.stringContaining('Bold'),
        }),
      ])
    );
  });

  it('aplica a cor customizada', () => {
    const { getByText } = render(
      <CustomText color="primary">Com Cor</CustomText>
    );
    const text = getByText('Com Cor');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: expect.any(String),
        }),
      ])
    );
  });

  it('permite passar estilos customizados', () => {
    const { getByText } = render(
      <CustomText style={{ marginTop: 32 }}>Custom Style</CustomText>
    );
    const text = getByText('Custom Style');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ marginTop: 32 }),
      ])
    );
  });
});
