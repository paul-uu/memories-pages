import React from 'react';
import { sortOptions, filterOptions } from '../constants/constants';
import styled from 'styled-components';

interface Props {
  filterMemories: (filter: string) => void;
  sortMemories: (sort: string) => void;
  toggleAddModal: (isOpen: any) => void; // look into this arg type
  searchMemories: () => void;
  count: number;
}

function Header(props: Props): React.ReactElement {
  return (
    <StyledHeader>
      <Title>Memory Collector</Title>
      <Count>{props.count || 0} Memories</Count>
      <Actions>
        <ActionLink onClick={props.toggleAddModal}>
          <i className="fa fa-plus" aria-hidden="true"></i>
          <span>Add Memory</span>
        </ActionLink>

        <ActionLink
          onClick={() => {
            alert('in progress');
          }}
        >
          <i className="fa fa-bar-chart" aria-hidden="true"></i>
          <span>Data Visualizations</span>
        </ActionLink>

        <Search
          onClick={() => {
            alert('in progress');
          }}
        >
          <i
            className="fa fa-search"
            aria-hidden="true"
            onClick={props.searchMemories}
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
          <select onChange={(e) => props.sortMemories(e.target.value)}>
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

export default Header;
