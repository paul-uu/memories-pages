import React, { Component } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import AddMemoryModal from './components/AddMemoryModal';
import styled from 'styled-components';
import mockMemories from './constants/mockData';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      memories: mockMemories,
      isAddMemoryModalOpen: false
    }
    this.updateMemories = this.updateMemories.bind(this);
    this.filterMemories = this.filterMemories.bind(this);
    this.sortMemories = this.sortMemories.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.searchMemories = this.searchMemories.bind(this);
    this.addMemory = this.addMemory.bind(this);
  }

  updateMemories(updatedMemoriesArray) {
    if (this.state.memories !== updatedMemoriesArray) {
      this.setState({ memories: updatedMemoriesArray })
    }
  }

  addMemory(memory) {
    if (memory) { // type validate
      this.setState(state => {
        const memories = [...state.memories, memory];
        return { memories };
      })
    }
  }

  filterMemories(filter) { // todo: multiple filters
    console.log(filter);
  }

  sortMemories(sort) {
    console.log(sort);
  }

  toggleAddModal(isOpen) {
    isOpen = typeof isOpen !== "boolean"
      ? !this.state.isAddMemoryModalOpen
      : isOpen;
    this.setState({ isAddMemoryModalOpen: isOpen });
  }

  searchMemories(memory) {
  }

  render() {
    const count = this.state.memories.length;
    return (
      <StyledApp>

        <AddMemoryModal
          toggleAddModal={ this.toggleAddModal }
          addMemory={ this.addMemory }
          isOpen={ this.state.isAddMemoryModalOpen } />

        <Header
          filterMemories={ this.filterMemories }
          sortMemories={ this.sortMemories }
          toggleAddModal={ this.toggleAddModal }
          searchMemories={ this.searchMemories }
          count={ count } />
        <Body 
          updateMemories={this.updateMemories}
          memories={this.state.memories} />
      </StyledApp>
    )
  }
}

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

export default App;