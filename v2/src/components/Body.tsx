import React from 'react';
import Memory from './Memory';
import styled from 'styled-components';

interface Props {
  updateMemories: (updatedMemories: []) => void;
  memories: any;
  sortBy: string;
  filterBy: string;
  viewMemory: Function;
}

const Body: React.FC<Props> = (props) => {

  const parseMemories = (memories: any, sortBy: string, filterBy: string) => {
    // handle sorting and filtering on memories array
    return memories;
  }  

  const { memories, sortBy, filterBy, viewMemory } = props;
  const parsedMemories = parseMemories(memories, sortBy, filterBy);

  return (
    <StyledBody>
      { parsedMemories.map((memory: any, i: number) => (
        <Memory 
          viewMemory={viewMemory} 
          memory={memory} 
          key={i} />
      )) }
    </StyledBody>
  )
}

const StyledBody = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
  align-content: flex-start;
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 150px 2px 1px 2px;
`;

export default Body;