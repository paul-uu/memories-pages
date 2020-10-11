import React, { useContext } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { IMemory } from '../constants/interfaces';
import { actions } from '../constants/constants';
import { MemoriesContext } from '../contexts';

ReactModal.setAppElement('#root');

interface Props {
  memory: IMemory | null;
  isOpen: boolean;
  toggle: Function;
}

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
