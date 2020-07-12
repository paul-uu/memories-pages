import React from 'react';
import styled from 'styled-components';
import { IMemory } from '../constants/interfaces';
import { getEmotionPercentages, getEmotionGradients } from '../utilities'

interface Props {
  memory: IMemory;
}

interface StyledMemoryProps {
  gradient: string;
}

const Memory: React.FC<Props> = (props) => {

  const test = () => { 
    console.log('memory click'); 
  }

  console.log(props);
  let gradient = props.memory.gradient.default;

  const StyledMemory = styled.div`
    width: 35px;
    height: 35px;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    background: ${(props: StyledMemoryProps) => props.gradient }
  `;

  return (
    <StyledMemory gradient={ gradient } onClick={ test } />
  );
}

export default Memory;