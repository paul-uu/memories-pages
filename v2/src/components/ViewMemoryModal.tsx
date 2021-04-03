import React, { useContext } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { IMemory } from '../constants/interfaces';
import { actions } from '../constants/constants';
import { MemoriesContext } from '../contexts';
import { RadialChart } from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';
import { emotions3 } from '../constants/constants';
import moment from 'moment';

ReactModal.setAppElement('#root');

interface Props {
  memory: IMemory | null;
  isOpen: boolean;
  toggle: Function;
}

const RadialChartContainer = styled.div`
  margin-bottom: 8px;
  text-align: center;
  > div {
    display: inline-block;
  }
`;

const MemoryDateTime = styled.div`
  margin-bottom: 8px;
`;

const MemoryText = styled.div`
  margin-bottom: 16px
`;

const Button = styled.button`
  margin-right: 8px;
  cursor: pointer;
`;

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

const radialChartLabelsStyle = {
}

const ViewMemoryModal = (props: Props) => {
  const memContext: any = useContext(MemoriesContext);
  if (props.memory) {
    const { text, emotions, dateTime } = props.memory;

    const formattedDateTime = moment(dateTime).format("dddd, MMMM Do YYYY, h:mm:ss A")

    return (
      <ReactModal
        isOpen={props.isOpen}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        role="dialog"
        contentLabel="View Memory"
      >
        <MemoryDateTime>{formattedDateTime}</MemoryDateTime>
        <RadialChartContainer>
          <RadialChart
            data={emotionObjToRadialChartObj(emotions)}
            width={300}
            height={300}
            colorType="literal"
            showLabels={true}
            labelsStyle={radialChartLabelsStyle}
          />
        </RadialChartContainer>
        <MemoryText>{text}</MemoryText>
        <Button onClick={() => props.toggle()}>Close</Button>
        <Button
          onClick={() => {
            memContext.dispatch({
              type: actions.DELETE,
              data: { memory: props.memory },
            });
            props.toggle();
          }}
        >
          Delete Memory
        </Button>
      </ReactModal>
    );
  }
  return null;
};

export default ViewMemoryModal;
