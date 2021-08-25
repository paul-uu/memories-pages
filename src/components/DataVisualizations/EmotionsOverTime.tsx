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
  Legend,
  ResponsiveContainer
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
      <EmotionsOverTimeContainer>
        <ResponsiveContainer>
          <BarChart 
            data={formattedMemories} 
            // width={1100} 
            // height={500}
            margin={{
              top: 25,
              right: 0,
              left: 0,
              bottom: 25,
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
        </ResponsiveContainer>
      </EmotionsOverTimeContainer>
    );
  }
  return null;
}

const EmotionsOverTimeContainer = styled.div`
  width: 100%;
  height: 90%;

  .recharts-legend-wrapper {
    bottom: 10px !important;
  }
`;

export default EmotionsOverTime;