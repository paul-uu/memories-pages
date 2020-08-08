import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import MemoryModal from './components/MemoryModal';
import styled from 'styled-components';
import { LOCALSTORAGEKEY } from './constants/constants';
import { IMemory } from './constants/interfaces';

const App: React.FC = () => {
  const loadMemories = () => {
    const memories = localStorage.getItem(LOCALSTORAGEKEY);
    if (memories) return JSON.parse(memories);
    else return [];
  };

  const [memories, setMemories] = useState(loadMemories());
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(memories));
  }, [memories]);

  const [selectedMemory, setSelectedMemory] = useState(null);
  useEffect(() => {
    if (selectedMemory !== null) {
      setIsMemoryModalOpen(true);
    }
  }, [selectedMemory]);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  useEffect(() => {
    if (!isMemoryModalOpen) {
      setSelectedMemory(null);
    }
  }, [isMemoryModalOpen]);

  const [sortBy, setSortBy] = useState<string>('');
  useEffect(() => {
    console.log(sortBy);
  }, [sortBy]);

  const [filterBy, setFilterBy] = useState<string>('');
  useEffect(() => {
    console.log(filterBy);
  }, [filterBy]);

  const updateMemories = (updatedMemoriesArray: []) => {
    if (memories !== updatedMemoriesArray) setMemories(updatedMemoriesArray);
  };

  const saveMemory = (memory: IMemory) => {
    const memoriesCopy = [...memories];
    for (let i = 0; i < memoriesCopy.length; i++) {
      if (memoriesCopy[i].id === memory.id) {
        memoriesCopy[i] = memory;
        return setMemories(memoriesCopy);
      }
    }
    memoriesCopy.push(memory);
    return setMemories(memoriesCopy);
  };

  const deleteMemory = (memoryId: string) => {
    setMemories(memories.filter((memory: IMemory) => memory.id !== memoryId));
  };

  const sortMemories = (sort: string) => {
    console.log('sort by ' + sort);
    setSortBy(sort);
  };

  const filterMemories = (filter: string) => {
    console.log('filter by: ' + filter);
    setFilterBy(filter);
  };

  const toggleAddModal = (isOpen: boolean) => {
    isOpen = typeof isOpen !== 'boolean' ? !isMemoryModalOpen : isOpen;
    setIsMemoryModalOpen(isOpen);
  };

  const searchMemories = () => {
    // todo
    return;
  };

  return (
    <StyledApp>
      <MemoryModal
        toggleAddModal={toggleAddModal}
        saveMemory={saveMemory}
        isOpen={isMemoryModalOpen}
        memory={selectedMemory}
        deleteMemory={deleteMemory}
      />

      <Header
        sortMemories={sortMemories}
        filterMemories={filterMemories}
        toggleAddModal={toggleAddModal}
        searchMemories={searchMemories}
        count={memories.length}
      />

      <Body
        updateMemories={updateMemories}
        memories={memories}
        sortBy={sortBy}
        filterBy={filterBy}
        viewMemory={setSelectedMemory}
      />
    </StyledApp>
  );
};

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

export default App;
