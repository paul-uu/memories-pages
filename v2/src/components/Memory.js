import React, { Component } from 'react';
import styled from 'styled-components';

const Memory = props => {

  const test = () => { console.log('memory click'); }

  const StyledMemory = styled.div`
    width: 35px;
    height: 35px;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    background: ${props => props.gradient}
  `;

  return (
    <StyledMemory
      gradient={ props.memory.gradient.default }
      onClick={ test } />
  );
}

export default Memory;