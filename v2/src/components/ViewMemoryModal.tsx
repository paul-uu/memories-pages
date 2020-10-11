import React, { useContext } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { IMemory } from '../constants/interfaces';
import { actions } from '../constants/constants';
import { MemoriesContext } from '../contexts';
import { RadialChart } from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';
import { emotions3 } from '../constants/constants';

ReactModal.setAppElement('#root');

interface Props {
  memory: IMemory | null;
  isOpen: boolean;
  toggle: Function;
}

const emotionObjToRadialChartObj = (emotions: any) => {
  const output = [];
  for (let emotion in emotions) {
    if (emotions[emotion]['percentage'] > 0) {
      output.push({
        angle: emotions[emotion]['percentage'],
        label: emotion,
        color: emotions3[emotion]['color'],
      });
    }
  }
  return output;
};

const ViewMemoryModal = (props: Props) => {
  const memContext: any = useContext(MemoriesContext);
  if (props.memory) {
    const { text, emotions, dateTime } = props.memory;
    return (
      <ReactModal
        isOpen={props.isOpen}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        role="dialog"
        contentLabel="View Memory"
      >
        <RadialChart
          data={emotionObjToRadialChartObj(emotions)}
          width={200}
          height={200}
          colorType="literal"
          showLabels={true}
        />

        <div>{dateTime}</div>
        <div>{text}</div>
        <button onClick={() => props.toggle()}>Close</button>
        <button
          onClick={() => {
            memContext.dispatch({
              type: actions.DELETE,
              data: { memory: props.memory },
            });
            props.toggle();
          }}
        >
          Delete Memory
        </button>
      </ReactModal>
    );
  }
  return null;
};

export default ViewMemoryModal;
