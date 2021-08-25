import React, { useState, useEffect, useReducer } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import MemoryModal from './components/MemoryModal';
import VisualizationContainer from './components/VisualizationContainer';
import styled from 'styled-components';
import {
  LOCALSTORAGEKEY,
  sortOptions,
  filterOptions,
} from './constants/constants';
import memoriesReducer from './reducers';
import { MemoriesContext } from './contexts';

const App: React.FC = () => {
  const loadMemories = () => {
    const memories = localStorage.getItem(LOCALSTORAGEKEY);
    if (memories) return JSON.parse(memories);
    else return [];
  };

  const [memories, dispatch] = useReducer(memoriesReducer, loadMemories());
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(memories));
  }, [memories]);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>(sortOptions.new.value);
  const [filterBy, setFilterBy] = useState<string>(filterOptions.all.value);
  const [searchString, setSearchString] = useState<string>('');
  const [isDataVizOpen, setIsDataVizOpen] = useState<boolean>(false);

  const toggleAddModal = (isOpen: boolean) => {
    isOpen = typeof isOpen !== 'boolean' ? !isMemoryModalOpen : isOpen;
    setIsMemoryModalOpen(isOpen);
  };

  const toggleDataViz = () => {
    setIsDataVizOpen(isDataVizOpen => !isDataVizOpen);
  }

  return (
    <MemoriesContext.Provider
      value={{ memories: memories, dispatch: dispatch }}
    >
      <StyledApp>
        <MemoryModal
          toggleAddModal={toggleAddModal}
          isOpen={isMemoryModalOpen}
        />

        <Header
          sortMemories={setSortBy}
          filterMemories={setFilterBy}
          toggleAddModal={toggleAddModal}
          toggleDataViz={toggleDataViz}
          searchString={searchString}
          setSearch={setSearchString}
          count={memories.length}
        />

        <VisualizationContainer 
          memories={memories}
          isOpen={isDataVizOpen}
          setIsOpen={setIsDataVizOpen}
        />

        <Body
          memories={memories}
          sortBy={sortBy}
          filterBy={filterBy}
          searchString={searchString}
        />
      </StyledApp>
    </MemoriesContext.Provider>
  );
};

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

export default App;
