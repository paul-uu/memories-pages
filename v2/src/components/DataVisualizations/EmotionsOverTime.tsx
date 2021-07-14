import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { VerticalBarSeries, XYPlot } from 'react-vis';

interface Props {
  memories: any;
}

const EmotionsOverTime = (props: Props) => {

  const { memories } = props;

  useEffect(() => {
    console.log(props);
  }, [props]);


  /*
  1. https://uber.github.io/react-vis/documentation/series-reference/bar-series

  bar graph: 
  - Each memory is plotted as a bar with 1 or more segments, each colored/sized by emotion(s)
  - on bar hover, show memory details

  y: emotion intensity number scale 0-10
  x: time* 

  for y axis, have 2 modes:
  'compressed' : each bar is spaced equally apart (right next to each other)
  'to scale'   : the y axis spans from memories[0].dataTime to memories[last].dateTime, bars placed by dateTime
  */

  return (
    <>
    {/*
    <XYPlot
      stackBy="y"
      xDomain={[0, memories.length]}
      yDomain={[0, 10]}
      height={100}
      width={100}
    >
      <VerticalBarSeries 
        stack={true}
        data={[]}
      />

    </XYPlot>
    */}
    </>
  );
}

const EmotionsOverTimeContainer = styled.div`

`;

export default EmotionsOverTime;