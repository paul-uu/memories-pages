import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import MemoryModal from './components/MemoryModal';
import styled from 'styled-components';
import {
  LOCALSTORAGEKEY,
  sortOptions,
  filterOptions,
} from './constants/constants';
import useMemories from './hooks/useMemories';

const App: React.FC = () => {
  const loadMemories = () => {
    const memories = localStorage.getItem(LOCALSTORAGEKEY);
    if (memories) return JSON.parse(memories);
    else return [];
  };

  const [memories, dispatch] = useMemories(loadMemories());
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(memories));
  }, [memories]);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>(sortOptions.new.value);
  const [filterBy, setFilterBy] = useState<string>(filterOptions.all.value);
  const [searchString, setSearchString] = useState<string>('');

  const toggleAddModal = (isOpen: boolean) => {
    isOpen = typeof isOpen !== 'boolean' ? !isMemoryModalOpen : isOpen;
    setIsMemoryModalOpen(isOpen);
  };

  return (
    <StyledApp>
      <MemoryModal
        toggleAddModal={toggleAddModal}
        isOpen={isMemoryModalOpen}
        dispatch={dispatch}
      />

      <Header
        sortMemories={setSortBy}
        filterMemories={setFilterBy}
        toggleAddModal={toggleAddModal}
        searchString={searchString}
        setSearch={setSearchString}
        count={memories.length}
      />

      <Body
        memories={memories}
        sortBy={sortBy}
        filterBy={filterBy}
        searchString={searchString}
        dispatch={dispatch}
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
