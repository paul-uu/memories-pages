import React, { Component } from 'react';

class Memory extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
    <div>{ this.props.memory.text }</div>
    )
  }
}

export default Memory;