import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { emotions3 } from '../../constants/constants';
import { IMemory } from '../../constants/interfaces';

interface Props {
  memories: IMemory[];
}

const EmotionsOverTime = (props: Props) => {

  const { memories } = props;

  if (memories) {
    let formattedMemories = memories.map((m:any) => {
      //const date = format(new Date(m.dateTime), 'MM/dd/yy - h:mm aaaa');
      const date = format(new Date(m.dateTime), 'MM/dd/yy');
      return {
        date,
        joy: m.emotions.joy.percentage,
        anger: m.emotions.anger.percentage,
        sadness: m.emotions.sadness.percentage,
        fear: m.emotions.fear.percentage,
        disgust: m.emotions.disgust.percentage,
        neutral: m.emotions.neutral.percentage,
        id: m.id,
        text: m.text
      }
    });

    return (
      <BarChart 
        data={formattedMemories} 
        width={1100} 
        height={500}
        margin={{
          top: 75,
          right: 75,
          left: 75,
          bottom: 75,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="joy" stackId="a" fill={emotions3.joy.color} />
        <Bar dataKey="anger" stackId="a" fill={emotions3.anger.color} />
        <Bar dataKey="sadness" stackId="a" fill={emotions3.sadness.color} />
        <Bar dataKey="fear" stackId="a" fill={emotions3.fear.color} />
        <Bar dataKey="disgust" stackId="a" fill={emotions3.disgust.color} />
        <Bar dataKey="neutral" stackId="a" fill={emotions3.neutral.color} />
      </BarChart>
    );
  }
  return null;
}

const EmotionsOverTimeContainer = styled.div`
`;

export default EmotionsOverTime;