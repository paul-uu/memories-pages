import React, { Component } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import styled from 'styled-components';

import mockMemories from './constants/mockData';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      memories: mockMemories
    }
    this.updateMemories = this.updateMemories.bind(this);
    this.filterMemories = this.filterMemories.bind(this);
    this.sortMemories = this.sortMemories.bind(this);
  }

  updateMemories(updatedMemoriesArray) {
    if (this.state.memories !== updatedMemoriesArray) {
      this.setState({ memories: updatedMemoriesArray })
    }
  }

  filterMemories(filter) { // todo: multiple filters
    console.log(filter);
  }

  sortMemories(sort) {
    console.log(sort);
  }

  render() {
    const count = this.state.memories.length;
    return (
      <StyledApp>
        <Header
          filterMemories={ this.filterMemories }
          sortMemories={ this.sortMemories }
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