import React, { Component } from 'react';
import { emotions, sortOptions, filterOptions } from "../constants/constants";
import styled from 'styled-components';

class Header extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(e) {
    if (e.target.value) 
      this.props.filterMemories(e.target.value);
  }
  
  render() {
    return (
      <StyledHeader>
        <h3>Memory Collector</h3>

        <div>
          <strong>{ this.props.count || 0 }</strong> Memories
        </div>

        <i className="fa fa-plus" aria-hidden="true" onClick={ this.props.toggleAddModal }></i>

        <select onChange={e => this.props.sortMemories(e.target.value)}>
        { Object.values(sortOptions).map(option => 
          <option key={option.label} value={option.value}>{option.label}</option>
        )}
        </select>

        <select onChange={e => this.props.filterMemories(e.target.value)}>
        { Object.values(filterOptions).map(option => 
          <option key={option.label} value={option.value}>{ option.label }</option>
        )}
        </select>

        <i className="fa fa-search" aria-hidden="true" onClick={ this.props.searchMemories }></i>

      </StyledHeader>
    )
  }
}

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  padding: 0 15px;
  height: initial;
  width: 100%;
  background-color: white;
  z-index: 6;
  -webkit-box-shadow: 0px 1px 4px 0px rgba(170,170,170,1);
  -moz-box-shadow: 0px 1px 4px 0px rgba(170,170,170,1);
  box-shadow: 0px 1px 4px 0px rgba(170,170,170,1);
`;

export default Header;