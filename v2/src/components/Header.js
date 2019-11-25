import React, { Component } from 'react';
import { emotions } from "../constants/constants";
import styled from 'styled-components';

class Header extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};

    this.sortOptions = {
      new: {
        label: "Newest",
        value: "new"
      },
      old : {
        label: "Oldest",
        value: "old"
      },
      joy: {
        label: "Joyful",
        value: emotions.joy
      },
      anger: {
        label: "Anger",
        value: emotions.anger
      },
      sad: {
        label: "Sadness",
        value: emotions.sadness
      },
      fear: {
        label: "Fearful",
        value: emotions.fear
      },
      disgust: {
        label: "Disgusting",
        value: emotions.disgust
      },
      neutral: {
        label: "Neutral",
        value: emotions.neutral
      }
    };
    this.filterOptions = {
      all: {
        label: "All",
        value: "all"
      },
      joy: {
        label: "Joy",
        value: emotions.joy
      },
      anger: {
        label: "Anger",
        value: emotions.anger
      },
      sad: {
        label: "Sad",
        value: emotions.sadness
      },
      fear: {
        label: "Fearful",
        value: emotions.fear
      },
      disgust: {
        label: "Disgusting",
        value: emotions.disgust
      },
      neutral: {
        label: "Neutral",
        value: emotions.neutral
      },
      core: {
        label: "Core Memories",
        value: "core"
      }
    };

    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleSortChange(e) {
    if (e.target.value) 
      this.props.sortMemories(e.target.value);
  }
  handleFilterChange(e) {
    if (e.target.value) 
      this.props.sortMemories(e.target.value);
  }
  
  render() {
    return (
      <StyledHeader>
        <h3>Memory Collector</h3>

        <div>
          <strong>{ this.props.count || 0 }</strong> Memories
        </div>

        <i className="fa fa-plus" aria-hidden="true" onClick={ this.props.toggleAddModal }></i>

        <select onChange={ this.handleSortChange }>
        { Object.values(this.sortOptions).map(option => 
          <option key={option.label} value={option.value}>{ option.label }</option>) 
        }
        </select>

        <select onChange={ this.handleFilterChange }>
        { Object.values(this.filterOptions).map(option => 
          <option key={option.label} value={option.value}>{ option.label }</option>) 
        }
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