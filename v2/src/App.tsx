import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import AddMemoryModal from './components/AddMemoryModal';
import styled from 'styled-components';
import mockMemories from './constants/mockData';
import { LOCALSTORAGEKEY } from './constants/constants';

const App: React.FC = () => {

  const loadMemories = () => {
    let memories = localStorage.getItem(LOCALSTORAGEKEY);
    if (memories) {
      console.log('memories from localstorage');
      return JSON.parse(memories);
    } 
    else {
      return mockMemories;
    }
  }

  const [memories, setMemories] = useState(loadMemories());
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(memories));
  }, [memories]);

  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);
  
  const [sortBy, setSortBy] = useState<string>('');
  useEffect(() => {
    console.log(sortBy);
  }, [sortBy])

  const [filterBy, setFilterBy] = useState<string>('');




  const updateMemories = (updatedMemoriesArray: []) => {
    if (memories !== updatedMemoriesArray)
      setMemories(updatedMemoriesArray)
  }

  const addMemory = (memory: any) => { // todo: add memory type
    if (memory)
      setMemories((memories: any) => [...memories, memory]);
  }

  const sortMemories = (sort: string) => {
    console.log('sort by ' + sort);
    setSortBy(sort);
  }

  const filterMemories = (filter: string) => {
    console.log('filter by: ' + filter);
    setFilterBy(filter);
  }

  const toggleAddModal = (isOpen: boolean) => {
    isOpen = typeof isOpen !== "boolean"
      ? !isAddMemoryModalOpen
      : isOpen;
    setIsAddMemoryModalOpen(isOpen);
  }

  const searchMemories = () => { // todo
    return;
  }


    return (
      <StyledApp>
        <AddMemoryModal
          toggleAddModal={ toggleAddModal }
          addMemory={ addMemory }
          isOpen={ isAddMemoryModalOpen } />

        <Header
          sortMemories={ sortMemories }
          filterMemories={ filterMemories }
          toggleAddModal={ toggleAddModal }
          searchMemories={ searchMemories }
          count={ memories.length } />

        <Body 
          updateMemories={updateMemories}
          memories={memories}
          sortBy={sortBy}
          filterBy={filterBy} />
      </StyledApp>
    )
  
}

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

export default App;