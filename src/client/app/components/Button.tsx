import React, { Component } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;

  border-radius: 8px;
  padding: 12px 16px;

  background: #eeeeee;
`;

interface ButtonProps {
  children: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

class Button extends Component<ButtonProps, {}> {
  render() {
    return (
      <Container onClick={this.props.onClick}>
        <span>{this.props.children}</span>
      </Container>
    );
  }
}

export default Button;
