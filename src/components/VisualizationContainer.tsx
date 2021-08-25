import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import EmotionsOverTime from './DataVisualizations/EmotionsOverTime';

interface Props {
  memories: any;
  isOpen: boolean;
  setIsOpen: Function;
}

const types: any = {
  overTime: { 
    label: 'emotions over time',
    value: 'overTime'
  }
}

function VisualizationContainer(props: Props): React.ReactElement | null {

  const { memories, isOpen, setIsOpen } = props;
  const [selectedType, setSelectedType] = useState(types.overTime.value);
  
  //if (isOpen) {
    return (
      <Wrapper className={isOpen ? 'open' : 'closed'}>

        <Dropdown>
          <DropdownLabel>Visualization Type</DropdownLabel>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          { Object.keys(types).map(type => 
              <option key={type} value={type}>{types[type].label}</option>
            )
          }
          </select>
        </Dropdown>

        <Close onClick={e => setIsOpen(false)}>Close</Close>

        <DataVisualizationContainer>
          <label>{ types[selectedType].label }</label>
          <DataVisualization 
            className='data-visualization' 
            type={selectedType} 
            memories={memories} 
          />
        </DataVisualizationContainer>

      </Wrapper>
    )
  //}
  //else return null;
}

interface DataVisualizationProps {
  className: string;
  type: string;
  memories: any;
}

const DataVisualization = (props: DataVisualizationProps) => {
  const { type, memories } = props;
  switch (type) {
    case types.overTime.value:
      return <EmotionsOverTime memories={memories} />;
    default:
      return <EmotionsOverTime memories={memories} />;
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  padding: 25px;
  color: #555;
  z-index: 7;
  background-color: rgba(255,255,255,1);
  left: 0;
  transition: all .5s ease-out;
  
  &.closed {
    background-color: rgba(255,255,255,0);
    pointer-events: none;
    color: #fff;
    left: -100%;
  }

`;

const Dropdown = styled.div`
  margin-bottom: 25px;
  
`;
const DropdownLabel = styled.div`
  font-size: 10px;
  color: #bbb;
  font-weight: 400;
`;

const Close = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #000;
  }
`;


const DataVisualizationContainer = styled.div`

  width: 100%;
  height: 90%;

  .data-visualization-label {
    font-size: 10px;
    color: #bbb;
    font-weight: 400;
  }

  .data-visualization {
    padding-top: 25px;
  }
`;

export default VisualizationContainer;