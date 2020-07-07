import React from 'react';
import { emotions, sortOptions, filterOptions } from "../constants/constants";
import styled from 'styled-components';

interface Props {
  filterMemories: (filter: string) => void;
  sortMemories: (sort: string) => void;
  toggleAddModal: (isOpen: any) => void; // look into this arg type
  searchMemories: () => void;
  count: number;
}

const Header: React.FC<Props> = (props) => {

  const handleFilterChange = (e: any) => {
    if (e.target.value) 
      props.filterMemories(e.target.value);
  }
  

  return (
    <StyledHeader>
      <h3>Memory Collector</h3>

      <div>
        <strong>{ props.count || 0 }</strong> Memories
      </div>

      <i className="fa fa-plus" aria-hidden="true" onClick={ props.toggleAddModal }></i>

      <select onChange={e => props.sortMemories(e.target.value)}>
      { Object.values(sortOptions).map(option => 
        <option key={option.label} value={option.value}>{option.label}</option>
      )}
      </select>

      <select onChange={e => props.filterMemories(e.target.value)}>
      { Object.values(filterOptions).map(option => 
        <option key={option.label} value={option.value}>{ option.label }</option>
      )}
      </select>

      <i className="fa fa-search" aria-hidden="true" onClick={ props.searchMemories }></i>

    </StyledHeader>
  )
  
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