import React,  { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { IMemory, Emotion } from '../constants/interfaces';
import { emotions3 } from '../constants/constants';
import styled from 'styled-components';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import { generateId, isObjEmpty } from '../utilities';

interface Props {
  toggleAddModal: (isOpen: any) => void;
  addMemory: (memory: any) => void;
  isOpen: boolean;
  memory?: IMemory;
}

ReactModal.setAppElement('#root');

const AddMemoryModal: React.FC<Props> = (props) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [memory, setMemory] = useState<IMemory>(initEmptyMemory());

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
  const [gradient, setGradient] = useState({default: '', moz: '', webkit: ''});

  const [errors, setErorrs] = useState<string[]>([]); // eventually, define Error type { message: string, type: string? }

  /*
  useEffect(() => {
    if (props.memory) {
      setMemoryFromProps(props.memory)
    }
  });

  const setMemoryFromProps = (memory: Memory): void => {
    const {dateTime, text, media, isCoreMemory, emotions, gradient} = memory;
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


  function initEmptyMemory(): IMemory {
    const emptyMemory: IMemory = {
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
      gradient: {
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

  const setEmotionPercentages = (emotions: {}) => {
    let emotionsCopy = Object.assign({}, emotions);
    let valuesTotal = getValuesTotal(emotionsCopy);
    for (let emotion in emotionsCopy) {
      // @ts-ignore
      let value = emotionsCopy[emotion].value;
      // @ts-ignore
      emotionsCopy[emotion].percentage = (value / valuesTotal) * 100;
    }
    return emotionsCopy;

    function getValuesTotal(emotionsObj: {}):number {
      let valueTotal = 0;
      if (!isObjEmpty(emotionsObj)) {
        console.log(emotionsObj);
        for (let emotion in emotionsObj) {
          // @ts-ignore
          valueTotal += emotionsObj[emotion].value;
        } 
      }
      return valueTotal;
    }
  }
  const setMemoryGradient = (emotions: {}): string => { // todo: accommodate single emotion value
    let str = 'linear-gradient(to bottom, ';
    let percentageTotal = 0;
    for (let emotion in emotions) {
      //@ts-ignore
      let percentage = emotions[emotion].percentage;
      if (percentage) {
        percentageTotal += percentage;
        let hex = emotions3[emotion].color;
        str += percentageTotal < 100 
          ? `${hex} ${percentageTotal}%, ` 
          : `${hex}`;
      }
    }
    return str + ');';
  }
  

  const handleInputChange = (e: any) => {
    const currentMemory = Object.assign({}, memory);
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (e.target.name === 'text') {
      if (value.trim().length > 0) {
        console.log('remove no-text error');
      }
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

  const saveMemory = (memory: IMemory) => {
    props.addMemory(memory);
  }

  const handleSave = () => {
    const memoryToSave = Object.assign({}, memory);

    if (isMemoryValid(memoryToSave)) {

      // set dateTime to time of save
      memoryToSave.dateTime = new Date();
      memoryToSave.emotions = setEmotionPercentages(memoryToSave.emotions);
      memoryToSave.gradient.default = setMemoryGradient(memoryToSave.emotions);

      saveMemory(memoryToSave)
      resetForm();
      props.toggleAddModal(false);
      // add 'Save and Add Another' option?
    }
  }
  const isMemoryValid = (memory: IMemory): boolean => {
    let errorMessages = [];
    if (memory.text.trim().length <= 0) {
      errorMessages.push('Please add a description of your memeory')
    }
    if (!hasEmotions(memory.emotions)) {
      errorMessages.push('But how did you feel??')
    }
    if (errorMessages.length > 0) {
      setErorrs(errorMessages);
      return false;
    }
    return true;
  }
  const hasEmotions = (emotions: {}): boolean => {
    for (let emotion in emotions) {
      // @ts-ignore
      if (emotions[emotion].value > 0)
        return true;
    }
    return false;
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

      <br />
      { errors.length > 0 && errors.map((error, i) => <div key={i}>{error}</div>)}
      <br />

      <div>
        <button onClick={ handleCancel }>Cancel</button>
        <button onClick={ resetForm }>Reset</button>
        <button onClick={ handleSave }>Save Memory</button>
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