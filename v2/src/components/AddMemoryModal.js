import React,  { Component } from 'react';
import ReactModal from 'react-modal';
import { emotions, emotions2 } from '../constants/constants';
import mockMemories from '../constants/mockData';
import mockMemories2 from '../constants/mockData2';
import styled from 'styled-components';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import { generateId } from '../utilities';

ReactModal.setAppElement('#root');

class AddMemoryModal extends Component {
  constructor(props) {
    super(props);

    this.state ={
      isOpen: false,
      memory: props.memory 
        ? props.memory 
        : this.initEmptyMemory()
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.saveMemory = this.saveMemory.bind(this);
    this.constructMemory = this.constructMemory.bind(this);
    this.initEmptyMemory = this.initEmptyMemory.bind(this);
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps
  }
  */

  initEmptyMemory() {
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

  handleSliderChange(val, emotion) {
    const { memory } = { ...this.state };
    const currentMemory = memory;
    currentMemory.emotions[emotion] = val;
    this.setState({ memory: currentMemory });
  }

  handleInputChange(e) {
    const { memory } = { ...this.state };
    const currentMemory = memory;
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    currentMemory[name] = value;
    this.setState({ memory: currentMemory });
  }

  resetForm() {
    this.setState({ 
      memory: this.initEmptyMemory()
    }, () => { 
      console.log('reset!'); 
    })
  }

  handleCancel() {
    this.resetForm();
    this.props.toggleAddModal(false);
  }

  saveMemory() {
    this.props.addMemory( this.constructMemory() )
    this.resetForm();
    this.props.toggleAddModal(false);
  }

  constructMemory() {
    return mockMemories2[0];
  }

  // todo: global -> { emotions } => percentages per relevant emotion
  // ex: { joy: 1, anger: 1 ... } => { joy: 50, anger: 50 }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        role="dialog"
        contentLabel="Add new memory modal"
      >
        <h3>Add New Memory</h3>
        <button onClick={ this.props.toggleAddModal }>Close</button>

        <textarea
          name='text'
          value={ this.state.memory.text } 
          onChange={ this.handleInputChange }>
        </textarea>
        <br /><br /><br />

        <label>Core Memory</label>
        <input 
          name='isCoreMemory'
          type='checkbox' 
          checked={ this.state.memory.isCoreMemory }
          onChange={ this.handleInputChange } />

        <StyledSliderContainer>
        { emotions2 && emotions2.map(emotion => 
            <StyledSlider 
              name={emotion} 
              key={emotion} 
              defaultValue={ this.state.memory.emotions[emotion] }
              value={ this.state.memory.emotions[emotion] }
              onChange={ (val) => { this.handleSliderChange(val, emotion) } }
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
          <button onClick={ this.handleCancel }>Cancel</button>
          <button onClick={ this.resetForm }>Reset</button>
          <button onClick={ this.saveMemory }>Save Memory</button>
        </div>

      </ReactModal>
    )
  }
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