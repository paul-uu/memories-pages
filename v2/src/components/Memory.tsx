import React from 'react';
import styled from 'styled-components';
import { IMemory } from '../constants/interfaces';

interface Props {
  memory: IMemory;
  viewMemory: Function;
}

interface StyledMemoryProps {
  gradient: string;
}

function Memory(props: Props): React.ReactElement {
  const { viewMemory, memory } = props;
  const gradient = props.memory.gradient.default;
  const StyledMemory = styled.div`
    width: 35px;
    height: 35px;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    background: ${(props: StyledMemoryProps) => props.gradient};
  `;

  return (
    <StyledMemory gradient={gradient} onClick={() => viewMemory(memory)} />
  );
}

export default Memory;
