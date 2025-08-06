import React from 'react';
import { render } from '@testing-library/react-native';
import Container from './index';
import { Text } from 'react-native';

describe('Container', () => {
  it('renderiza os filhos corretamente', () => {
    const { getByText } = render(
      <Container>
        <React.Fragment>
          <Text>Meu filho</Text>
        </React.Fragment>
      </Container>
    );
    expect(getByText('Meu filho')).toBeTruthy();
  });

  it('aceita estilos customizados', () => {
    const { getByTestId } = render(
      <Container style={{ backgroundColor: 'red' }} testID="container-test" >
        <Text>Teste</Text>
    </Container>
    );
    const container = getByTestId('container-test');
    expect(container.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: 'red' })])
    );
  });
});
