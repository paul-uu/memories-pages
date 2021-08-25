import React from 'react';
import styled from 'styled-components';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { emotions3 } from '../constants/constants';
import { IMemory } from '../constants/interfaces';

interface Props {
  onSliderChange: Function;
  memory: IMemory;
}

const StyledSliderContainer = styled.div`
  height: 25%;
  margin: 45px 0;
  display: flex;
  justify-content: space-around;
`;

const StyledSlider = styled(createSliderWithTooltip(Slider))`
  position: relative;
  > span {
    position: absolute;
    top: -30px;
    left: 0;
  }
`;

function Sliders(props: Props): React.ReactElement {
  const { memory, onSliderChange } = props;

  return (
    <StyledSliderContainer>
      {emotions3 &&
        Object.keys(emotions3).map((emotion) => {
          const { label } = emotions3[emotion];
          return (
            <StyledSlider
              key={label}
              defaultValue={memory.emotions[label].value}
              value={memory.emotions[label].value}
              onChange={(val: any) => onSliderChange(val, emotion)}
              min={0}
              max={10}
              step={1}
              vertical={true}
              handleStyle={{
                backgroundColor: emotions3[emotion].color,
                border: `2px solid ${emotions3[emotion].color}`,
              }}
              trackStyle={{
                backgroundColor: emotions3[emotion].color,
              }}
            >
              <span>{emotion}</span>
            </StyledSlider>
          );
        })}
    </StyledSliderContainer>
  );
}

export default Sliders;
