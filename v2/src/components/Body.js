import React, { Component } from 'react';
import Memory from './Memory';

class Body extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <>
        <div>Body</div>
        { this.props.memories.length > 0 && this.props.memories.map((memory, i) => 
          <Memory memory={memory} key={i} />
        )}
      </>
    )
  }
}

export default Body;