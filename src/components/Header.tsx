import React, { useState, useEffect } from 'react';
import { sortOptions, filterOptions } from '../constants/constants';
import styled from 'styled-components';

interface Props {
  filterMemories: (filter: string) => void;
  sortMemories: (sort: string) => void;
  toggleAddModal: (isOpen: any) => void; // look into this arg type
  toggleDataViz: () => void;
  searchString: string;
  setSearch: Function;
  count: number;
}

function Header(props: Props): React.ReactElement {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  useEffect(() => {
    if (!isSearchVisible) props.setSearch('');
  }, [isSearchVisible]);
  const toggleSearchVisibility = () => {
    setIsSearchVisible((isSearchVisible) => !isSearchVisible);
  };

  return (
    <>
      <StyledHeader>
        <Title>Memory Collector</Title>

        <Count>{props.count || 0} Memories</Count>

        <Actions>
          <ActionLink onClick={props.toggleAddModal}>
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span>Add Memory</span>
          </ActionLink>

          <ActionLink onClick={props.toggleDataViz}>
            
            <i className="fa fa-bar-chart" aria-hidden="true"></i>
            <span>Data Visualizations</span>
          </ActionLink>

          <Search onClick={toggleSearchVisibility}>
            <i
              className={`fa ${isSearchVisible ? 'fa-times' : 'fa-search'}`}
              aria-hidden="true"
            ></i>
          </Search>

          <Dropdown>
            <DropdownLabel>Sort By</DropdownLabel>
            <select onChange={(e) => props.sortMemories(e.target.value)}>
              {Object.values(sortOptions).map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Dropdown>

          <Dropdown>
            <DropdownLabel>Filter By</DropdownLabel>
            <select onChange={(e) => props.filterMemories(e.target.value)}>
              {Object.values(filterOptions).map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Dropdown>
          <div style={{ clear: 'both' }}></div>
        </Actions>
      </StyledHeader>
      <SearchInput className={isSearchVisible ? 'visible' : ''}>
        <input
          type="text"
          value={props.searchString}
          onChange={(e) => {
            props.setSearch(e.target.value);
          }}
        />
        <button onClick={() => props.setSearch('')}>Clear</button>
      </SearchInput>
    </>
  );
}

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  padding: 8px 16px;
  height: initial;
  width: 100%;
  background-color: white;
  z-index: 6;
  -webkit-box-shadow: 0px 1px 4px 0px rgba(170, 170, 170, 1x);
  -moz-box-shadow: 0px 1px 4px 0px rgba(170, 170, 170, 1);
  box-shadow: 0px 1px 4px 0px rgba(170, 170, 170, 1);
`;
const Title = styled.h3`
  float: left;
  font-weight: 400;
  font-size: 16px;
  color: #999;
  margin: 0;
`;
const Count = styled.div`
  float: right;
  font-weight: 400;
  font-size: 16px;
  color: #999;
`;
const Actions = styled.div`
  clear: both;
  padding-top: 24px;
  position: relative;
`;
const ActionLink = styled.div`
  .fa {
    margin-right: 8px;
  }
  float: left;
  margin-top: 14px;
  cursor: pointer;
  color: #555;
  @media (max-width: 599px) {
    span {
      display: none;
    }
  }
  &:not(:last-child) {
    margin-right: 16px;
  }
  &:hover {
    text-decoration: underline;
    color: #000;
  }
`;
const Dropdown = styled.div`
  float: right;
  margin-right: 16px;
`;
const DropdownLabel = styled.div`
  font-size: 10px;
  color: #bbb;
  font-weight: 400;
`;
const Search = styled.div`
  float: right;
  margin-top: 12px;
  cursor: pointer;
`;
const SearchInput = styled.div`
  position: absolute;
  top: 69px;
  right: 46px;
  z-index: 1;
  transition: top 0.2s;
  &.visible {
    top: 96px;
  }
`;

export default Header;
