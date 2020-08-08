import React, { useState, useEffect } from 'react';
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
`;

const StyledSlider = styled(createSliderWithTooltip(Slider))`
  display: inline-block;
  margin: 0 7%;

  :first-child {
    margin-left: 0;
  }
  :last-child {
    margin-right: 0;
  }

  position: relative;
  > span {
    position: absolute;
    top: -30px;
  }
`;

const Sliders: React.FC<Props> = (props) => {
  const { memory, onSliderChange } = props;

  return (
    <StyledSliderContainer>
      {emotions3 &&
        Object.keys(emotions3).map((emotion, i) => {
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
            >
              <span>{emotion}</span>
            </StyledSlider>
          );
        })}
    </StyledSliderContainer>
  );
};

export default Sliders;
