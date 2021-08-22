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
const Label = styled.label`
  display: block;
  margin-left: 10%;
  font-size: 13px;
  color: #555;
`;
const TitleInput = styled.input`
  width: 80%;
  margin-left: 10%;
  margin-bottom: 16px;
  display: block;
`;
const Textarea = styled.textarea`
  width: 80%;
  margin-left: 10%;
  margin-bottom: 16px;
`;
const CoreMemory = styled.div`
  margin-left: 10%;
  font-size: 13px;
  margin-bottom: 64px;
`;
const Buttons = styled.div`
  text-align: right;
  button {
    margin-right: 8px;
    cursor: pointer;
  }
`;

const StyledReactModal = styled(ReactModal)`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`

ReactModal.setAppElement('#root');

function MemoryModal(props: Props): React.ReactElement {
  const [memory, setMemory] = useState<any>(initEmptyMemory());
  const [errors, setErrors] = useState<string[]>([]); // eventually, define Error type { message: string, type: string? }
  const memContext: any = useContext(MemoriesContext);

  function initEmptyMemory(): IMemory {
    const emptyMemory: IMemory = {
      id: generateId(),
      dateTime: new Date().getTime(),
      title: '',
      description: '',
      media: { audio: '', image: '', video: '' },
      isCoreMemory: false,
      emotions: {
        joy: { percentage: 0, value: 0 },
        anger: { percentage: 0, value: 0 },
        sadness: { percentage: 0, value: 0 },
        fear: { percentage: 0, value: 0 },
        disgust: { percentage: 0, value: 0 },
        neutral: { percentage: 0, value: 0 },
      }
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

  const handleInputChange = (e: any) => {
    const currentMemory = Object.assign({}, memory);
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    currentMemory[e.target.name] = value;
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
    if (memory.title.trim().length <= 0) {
      errorMessages.push('Please add a title for your memory');
    }
    if (memory.description.trim().length <= 0) {
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

  return (
    <ReactModal
      isOpen={props.isOpen}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      role="dialog"
      contentLabel="Add new memory modal"
      style={{
        content: {
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
        }
      }}
    >
      <Header>
        <h3>Add New Memory</h3>
        <i className="fa fa-times" onClick={props.toggleAddModal}></i>
      </Header>

      <Label>Title</Label>
      <TitleInput 
        name='title'
        value={memory.title}
        onChange={handleInputChange}
      />

      <Label>Description</Label>
      <Textarea
        name="description"
        rows={5}
        value={memory.description}
        onChange={handleInputChange}
      />

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
