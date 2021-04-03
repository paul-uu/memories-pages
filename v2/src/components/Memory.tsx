import React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import moment from 'moment';
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
  const gradient = memory.gradient.default;
  const dateTime = formatDate(memory.dateTime);
  return (
    <>
      <StyledMemory
        gradient={gradient}
        onClick={() => viewMemory(memory)}
        data-tip="React-tooltip"
        data-for={memory.id}
      />
      <ReactTooltip place="top" id={memory.id} type="dark" effect="solid">
        <span>{memory.title && `${memory.title} - `}{dateTime}</span>
      </ReactTooltip>
    </>
  );
}

const formatDate = (ms: number) => {
  return moment(ms).format("M/D/YY, h:mm:ss a");
};

const StyledMemory = styled.div`
  width: 35px;
  height: 35px;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  background: ${(props: StyledMemoryProps) => props.gradient};
`;

export default Memory;
