import React, { Component } from 'react';
import Memory from './Memory';
import styled from 'styled-components';

class Body extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <StyledBody>
        { this.props.memories.length > 0 && this.props.memories.map((memory, i) => 
          <Memory memory={memory} key={i} />
        )}
      </StyledBody>
    )
  }
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