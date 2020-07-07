import React,  { useState } from 'react';
import ReactModal from 'react-modal';
import { emotions, emotions2 } from '../constants/constants';
import mockMemories from '../constants/mockData';
import mockMemories2 from '../constants/mockData2';
import styled from 'styled-components';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import { generateId } from '../utilities';

interface Props {
  toggleAddModal: (isOpen: any) => void;
  addMemory: (memory: any) => void;
  isOpen: boolean;
  memory?: any; // todo
}

ReactModal.setAppElement('#root');

const AddMemoryModal: React.FC<Props> = (props) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [memory, setMemory] = useState<any>(props.memory || initEmptyMemory());

  /*
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps
  }
  */

  function initEmptyMemory() {
    return {
      id: generateId(),
      dateTime: new Date(),
      text: '',
      media: { audio: '', image: '', video: '' },
      isCoreMemory: false,
      emotions: {
        joy: 0,
        anger: 0,
        sadness: 0,
        fear: 0,
        disgust: 0,
        neutral: 0
      }
    }
  }

  const handleSliderChange = (val: any, emotion: any) => {
    const currentMemory = memory;
    currentMemory.emotions[emotion] = val;
    setMemory(currentMemory);
  }

  const handleInputChange = (e: any) => {
    const currentMemory = memory;
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    currentMemory[name] = value;
    setMemory(currentMemory);
  }

  const resetForm = () => {
    setMemory(initEmptyMemory());
  }

  const handleCancel = () => {
    resetForm();
    props.toggleAddModal(false);
  }

  const saveMemory = () => {
    props.addMemory( constructMemory() )
    resetForm();
    props.toggleAddModal(false);
  }

  const constructMemory = () => {
    return mockMemories2[0];
  }

  // todo: global -> { emotions } => percentages per relevant emotion
  // ex: { joy: 1, anger: 1 ... } => { joy: 50, anger: 50 }
  return (
    <ReactModal
      isOpen={props.isOpen}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      role="dialog"
      contentLabel="Add new memory modal"
    >
      <h3>Add New Memory</h3>
      <button onClick={ props.toggleAddModal }>Close</button>

      <textarea
        name='text'
        value={ memory.text } 
        onChange={ handleInputChange }>
      </textarea>
      <br /><br /><br />

      <label>Core Memory</label>
      <input 
        name='isCoreMemory'
        type='checkbox' 
        checked={ memory.isCoreMemory }
        onChange={ handleInputChange } />

      <StyledSliderContainer>
      { emotions2 && emotions2.map(emotion => 
          <StyledSlider 
            key={emotion} 
            defaultValue={ memory.emotions[emotion] }
            value={ memory.emotions[emotion] }
            onChange={ (val: any) => { handleSliderChange(val, emotion) } }
            min={0} 
            max={10} 
            step={1} 
            vertical={true} >
            <span>{emotion}</span>
          </StyledSlider>
      )}
      </StyledSliderContainer>

      <div>
        <i className="fa fa-music" aria-hidden="true"></i>
        <i className="fa fa-picture-o" aria-hidden="true"></i>
        <i className="fa fa-video-camera" aria-hidden="true"></i>
      </div>

      <br /><br /><br />
      <div>
        <button onClick={ handleCancel }>Cancel</button>
        <button onClick={ resetForm }>Reset</button>
        <button onClick={ saveMemory }>Save Memory</button>
      </div>

    </ReactModal>
  )
}

const StyledSliderContainer = styled.div`
  height: 25%;
  margin: 45px 0;
`;

const StyledSlider = styled(createSliderWithTooltip(Slider))`
  display: inline-block;
  margin: 0 7%;

  :first-child { margin-left: 0; }
  :last-child  { margin-right: 0; }

  position: relative;
  > span {
    position: absolute;
    top: -30px;
  }
`;

export default AddMemoryModal;