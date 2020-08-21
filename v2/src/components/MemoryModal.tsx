import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { IMemory } from '../constants/interfaces';
import { emotions3, MONTHS, DAYS } from '../constants/constants';
// import Tooltip from 'rc-tooltip';
import { generateId, isObjEmpty } from '../utilities';
import Sliders from './Sliders';

interface Props {
  toggleAddModal: (isOpen: any) => void;
  saveMemory: (memory: any) => void;
  isOpen: boolean;
  memory?: IMemory | null;
  deleteMemory: Function;
}

ReactModal.setAppElement('#root');

function MemoryModal(props: Props): React.ReactElement {
  const [memory, setMemory] = useState<any>(props.memory || initEmptyMemory());
  useEffect(() => {
    if (props.memory) setMemory(props.memory);
  }, [props.memory]);

  const [errors, setErorrs] = useState<string[]>([]); // eventually, define Error type { message: string, type: string? }

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
      setErorrs(newErrors);
    } else {
      memoryToSave.dateTime = new Date().getTime();
      memoryToSave.emotions = setEmotionPercentages(memoryToSave.emotions);
      memoryToSave.gradient.default = setMemoryGradient(memoryToSave.emotions);
      props.saveMemory(memoryToSave);
      resetForm();
      props.toggleAddModal(false);
    }
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

  const handleDelete = () => {
    props.memory && props.deleteMemory(props.memory.id);
    props.toggleAddModal(false);
  };

  const formatDateTime = (dateTime: number | undefined) => {
    if (dateTime) {
      let d = new Date(dateTime);
      let day = DAYS[d.getDay()];
      let month = MONTHS[d.getMonth()];
      let formattedDate = `${day} ${month} ${d.getDate()}, ${d.getFullYear()}`;
      return formattedDate;
    }
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
      <h3>
        {props.memory
          ? formatDateTime(props.memory.dateTime)
          : 'Add New Memory'}
      </h3>
      <button onClick={props.toggleAddModal}>Close</button>

      <textarea
        name="text"
        value={memory.text}
        onChange={handleInputChange}
      ></textarea>
      <br />
      <br />
      <br />

      <label>Core Memory</label>
      <input
        name="isCoreMemory"
        type="checkbox"
        checked={memory.isCoreMemory}
        onChange={handleInputChange}
      />

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

      <div>
        <button onClick={handleCancel}>Cancel</button>

        {props.memory === null && <button onClick={resetForm}>Reset</button>}

        <button onClick={handleSave}>
          {props.memory === null ? 'Add' : 'Save'} Memory
        </button>

        {props.memory !== null && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </ReactModal>
  );
}

export default MemoryModal;
