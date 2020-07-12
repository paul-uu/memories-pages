import React,  { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { Memory, Emotion } from '../constants/interfaces';
import { emotions, emotions2, emotions3 } from '../constants/constants';
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
  memory?: Memory;
}

ReactModal.setAppElement('#root');

const AddMemoryModal: React.FC<Props> = (props) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [memory, setMemory] = useState<Memory>(initEmptyMemory());

  // need to conditionally set value from props
  const [dateTime, setDateTime] = useState()
  const [text, setText] = useState<string>('');
  const [media, setMedia] = useState({ audio: '', image: '', video: '' });
  const [isCoreMemory, isetICoreMemory] = useState<boolean>(false);
  const [anger, setAnger] = useState({percentage: 0, value: 0});
  const [disgust, setDisgust] = useState({percentage: 0, value: 0});
  const [fear, setFear] = useState({percentage: 0, value: 0});
  const [joy, setJoy] = useState({percentage: 0, value: 0});
  const [neutral, setNeutral] = useState({percentage: 0, value: 0});
  const [sadness, setSadness] = useState({percentage: 0, value: 0});
  const [gradients, setGradients] = useState({default: '', moz: '', webkit: ''});

  /*
  useEffect(() => {
    if (props.memory) {
      setMemoryFromProps(props.memory)
    }
  });

  const setMemoryFromProps = (memory: Memory): void => {
    const {dateTime, text, media, isCoreMemory, emotions, gradients} = memory;
    setDateTime(dateTime)
    setText(text);
    setMedia({ audio: memory.media.audio });
  }
  */

  /*
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps
  }
  */

  function initEmptyMemory():Memory {
    const emptyMemory: Memory = {
      id: generateId(),
      dateTime: undefined,
      text: '',
      media: { audio: '', image: '', video: '' },
      isCoreMemory: false,
      emotions: {
        joy: { percentage: 0, value: 0 },
        anger: { percentage: 0, value: 0 },
        sadness: { percentage: 0, value: 0 },
        fear: { percentage: 0, value: 0 },
        disgust: { percentage: 0, value: 0 },
        neutral: { percentage: 0, value: 0 }
      },
      gradients: {
        default: ''
      }
    }
    return emptyMemory;
  }

  const handleSliderChange = (val: any, emotion: any) => {
    let currentMemory = Object.assign({}, memory);
    currentMemory.emotions[emotion].value = val;
    setMemory(currentMemory);
  }

  const handleInputChange = (e: any) => {
    const currentMemory = Object.assign({}, memory);
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    // todo: fix ts index signature issue
    //currentMemory[name] = value;

    // temporary 
    if (e.target.name === 'text') {
      currentMemory.text = value;
    } else if (e.target.name === 'isCoreMemory') {
      currentMemory.isCoreMemory = value;
    }
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
  const getDateTime = () => {
    return {
      date: 1,
      day: 'Monday',
      month: 'July',
      year: 2020,
      time: "1",
      raw: 12345
    }
  }

  const constructMemory = ():Memory => {
    return {
      id: 'test',
      dateTime: new Date(),
      text,
      media,
      isCoreMemory,
      emotions: {
        anger, disgust, fear, joy, neutral, sadness
      },
      gradients
    }

    //return mockMemories2[0];
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
        {emotions3 && Object.keys(emotions3).map((emotion, i) => {
          let { label } = emotions3[emotion];
          console.log(memory.emotions);
          return (
            <StyledSlider 
              key={label} 
              defaultValue={memory.emotions[label].value}
              value={memory.emotions[label].value}
              onChange={ (val: any) => { handleSliderChange(val, emotion) } }
              min={0} 
              max={10} 
              step={1} 
              vertical={true} >
              <span>{emotion}</span>
            </StyledSlider>
          )
        })}
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