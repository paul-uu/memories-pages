import React from 'react';
import Memory from './Memory';
import styled from 'styled-components';
import { sortOptions, filterOptions } from '../constants/constants';
import { IMemory } from '../constants/interfaces';

interface Props {
  updateMemories: (updatedMemories: []) => void;
  memories: any;
  sortBy: string;
  filterBy: string;
  searchString: string;
  viewMemory: Function;
}

function Body(props: Props): React.ReactElement {
  const filterSortMemories = (
    memories: IMemory[],
    sortBy: string,
    filterBy: string,
    searchString: string
  ) => {
    let memoriesCopy = [...memories];

    if (searchString) {
      memoriesCopy = memoriesCopy.filter((m) => m.text.includes(searchString));
    }

    if (filterBy) {
      memoriesCopy = memoriesCopy.filter((m) => {
        if (filterBy === filterOptions.all.value) return true;
        else if (filterBy === filterOptions.core.value) return m.isCoreMemory;
        else return m.emotions[filterBy].value > 0;
      });
    }

    if (sortBy) {
      if (sortBy === sortOptions.new.value)
        memoriesCopy.sort((A, B) => B.dateTime - A.dateTime);
      else if (sortBy === sortOptions.old.value)
        memoriesCopy.sort((A, B) => A.dateTime - B.dateTime);
      else
        memoriesCopy.sort(
          (A, B) => B.emotions[sortBy].value - A.emotions[sortBy].value
        );
    }
    return memoriesCopy;
  };

  const { memories, sortBy, filterBy, viewMemory, searchString } = props;
  const parsedMemories = filterSortMemories(
    memories,
    sortBy,
    filterBy,
    searchString
  );

  return (
    <StyledBody>
      {parsedMemories.map((memory: any, i: number) => (
        <Memory viewMemory={viewMemory} memory={memory} key={i} />
      ))}
    </StyledBody>
  );
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
