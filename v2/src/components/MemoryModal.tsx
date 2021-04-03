import React, { useState, useContext } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { IMemory } from '../constants/interfaces';
import { emotions3 } from '../constants/constants';
import { generateId, isObjEmpty } from '../utilities';
import Sliders from './Sliders';
import { MemoriesContext } from '../contexts';

interface Props {
  toggleAddModal: (isOpen: any) => void;
  isOpen: boolean;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  h3 {
    margin-top: 0;
  }
  .fa {
    cursor: pointer;
    color: #555;
    &:hover {
      color: #333;
    }
  }
`;
const Textarea = styled.textarea`
  width: 80%;
  margin-left: 10%;
`;
const CoreMemory = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;
const Buttons = styled.div`
  text-align: right;
  button {
    margin-right: 8px;
    cursor: pointer;
  }
`;

ReactModal.setAppElement('#root');

function MemoryModal(props: Props): React.ReactElement {
  const [memory, setMemory] = useState<any>(initEmptyMemory());
  const [errors, setErrors] = useState<string[]>([]); // eventually, define Error type { message: string, type: string? }
  const memContext: any = useContext(MemoriesContext);

  function initEmptyMemory(): IMemory {
    const emptyMemory: IMemory = {
      id: generateId(),
      dateTime: new Date().getTime(),
      text: '',
      media: { audio: '', image: '', video: '' },
      isCoreMemory: false,
      emotions: {
        joy: { percentage: 0, value: 0 },
        anger: { percentage: 0, value: 0 },
        sadness: { percentage: 0, value: 0 },
        fear: { percentage: 0, value: 0 },
        disgust: { percentage: 0, value: 0 },
        neutral: { percentage: 0, value: 0 },
      },
      gradient: {
        default: '',
      },
    };
    return emptyMemory;
  }

  const handleSliderChange = (val: any, emotion: any) => {
    const currentMemory = Object.assign({}, memory);
    currentMemory.emotions[emotion].value = val;
    setMemory(currentMemory);
  };

  const setEmotionPercentages = (emotions: {}) => {
    const emotionsCopy = Object.assign({}, emotions);
    const valuesTotal = getValuesTotal(emotionsCopy);
    for (const emotion in emotionsCopy) {
      // @ts-ignore
      const value = emotionsCopy[emotion].value;
      // @ts-ignore
      emotionsCopy[emotion].percentage = (value / valuesTotal) * 100;
    }
    return emotionsCopy;

    function getValuesTotal(emotionsObj: {}): number {
      let valueTotal = 0;
      if (!isObjEmpty(emotionsObj)) {
        console.log(emotionsObj);
        for (const emotion in emotionsObj) {
          // @ts-ignore
          valueTotal += emotionsObj[emotion].value;
        }
      }
      return valueTotal;
    }
  };

  const setMemoryGradient = (emotions: {}): string => {
    let str = 'linear-gradient(to bottom, ';
    let percentageTotal = 0;
    for (const emotion in emotions) {
      //@ts-ignore
      const percentage = emotions[emotion].percentage;
      if (percentage) {
        const hex = emotions3[emotion].color;
        if (percentage === 100) {
          return hex;
        } else {
          percentageTotal += percentage;
          str +=
            percentageTotal < 100 ? `${hex} ${percentageTotal}%, ` : `${hex}`;
        }
      }
    }
    return str + ');';
  };

  const handleInputChange = (e: any) => {
    const currentMemory = Object.assign({}, memory);
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (e.target.name === 'text') {
      if (value.trim().length > 0) {
        console.log('remove no-text error');
      }
      currentMemory.text = value;
    } else if (e.target.name === 'isCoreMemory') {
      currentMemory.isCoreMemory = value;
    }
    setMemory(currentMemory);
  };

  const resetForm = () => {
    setMemory(initEmptyMemory());
  };

  const handleCancel = () => {
    resetForm();
    props.toggleAddModal(false);
  };

  const handleSave = () => {
    const memoryToSave = Object.assign({}, memory);
    const newErrors = getMemoryErrors(memoryToSave);
    if (newErrors.length > 0) {
      return setErrors(newErrors);
    } 
    else {
      memoryToSave.dateTime = new Date().getTime();
      memoryToSave.emotions = setEmotionPercentages(memoryToSave.emotions);
      memoryToSave.gradient.default = setMemoryGradient(memoryToSave.emotions);
      memContext.dispatch({
        type: 'SET',
        data: { memory: memoryToSave },
      });
      resetForm();
      props.toggleAddModal(false);
    }
  };

  const isSaveDisabled = () => {
    return getMemoryErrors(Object.assign({}, memory)).length > 0;
  };

  const getMemoryErrors = (memory: IMemory): string[] => {
    const errorMessages = [];
    if (memory.text.trim().length <= 0) {
      errorMessages.push('Please add a description of your memeory');
    }
    if (!hasEmotions(memory.emotions)) {
      errorMessages.push('But how did you feel??');
    }
    return errorMessages;
  };
  const hasEmotions = (emotions: {}): boolean => {
    for (const emotion in emotions) {
      // @ts-ignore
      if (emotions[emotion].value > 0) return true;
    }
    return false;
  };

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
      <Header>
        <h3>Add New Memory</h3>
        <i className="fa fa-times" onClick={props.toggleAddModal}></i>
      </Header>

      <Textarea
        name="text"
        rows={5}
        value={memory.text}
        onChange={handleInputChange}
      ></Textarea>

      <CoreMemory>
        <label>Core Memory</label>
        <input
          name="isCoreMemory"
          type="checkbox"
          checked={memory.isCoreMemory}
          onChange={handleInputChange}
        />
      </CoreMemory>

      <Sliders onSliderChange={handleSliderChange} memory={memory} />

      <div>
        <i className="fa fa-music" aria-hidden="true"></i>
        <i className="fa fa-picture-o" aria-hidden="true"></i>
        <i className="fa fa-video-camera" aria-hidden="true"></i>
      </div>

      <br />
      {errors.length > 0 &&
        errors.map((error, i) => <div key={i}>{error}</div>)}
      <br />

      <Buttons>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={resetForm}>Reset</button>
        <button onClick={handleSave} disabled={isSaveDisabled()}>
          Save Memory
        </button>
      </Buttons>
    </ReactModal>
  );
}

export default MemoryModal;
