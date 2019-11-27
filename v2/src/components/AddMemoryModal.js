import React,  { Component } from 'react';
import ReactModal from 'react-modal';
import { emotions, emotions2 } from '../constants/constants';
import mockMemories from '../constants/mockData';
import styled from 'styled-components';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

ReactModal.setAppElement('#root');

class AddMemoryModal extends Component {
  constructor(props) { // to check: props.memory ? edit/update props.memory, check for memory ts type : create new from scratch
    super(props);

    this.state = {
      isOpen: false,
      memory: '',
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

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);

    this.saveMemory = this.saveMemory.bind(this);
    this.constructMemory = this.constructMemory.bind(this);
  }

  handleSliderChange(val, emotion) {
    this.setState({ [emotion]: val });
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ [target.name]: value })
  }

  resetForm() {
    this.setState({
      memory: '',
      isCoreMemory: false,
      joy: 0,
      anger: 0,
      sadness: 0,
      fear: 0,
      disgust: 0,
      neutral: 0
    }, () => { console.log('reset!'); })
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
    console.log(this.state.emotions);

    return mockMemories[0];

    /* // to update usage of Memory model
    return {
      date: new Date(), // to replace verbose date usage
      text: this.state.memory,
      media: {
        audio: "",
        image: "",
        video: ""
      },
      isCoreMemory: this.state.isCoreMemory,
      emotions: this.state.emotions, // to replace explicit percentage values, calc as needed?
    }
    */
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
          name='memory'
          value={ this.state.memory } 
          onChange={ this.handleInputChange }>
        </textarea>
        <br /><br /><br />

        <label>Core Memory</label>
        <input 
          name='isCoreMemory'
          type='checkbox' 
          checked={ this.state.isCoreMemory }
          onChange={ this.handleInputChange } />

        <StyledSliderContainer>
        { emotions2 && emotions2.map(emotion => 
            <StyledSlider 
              name={emotion} 
              key={emotion} 
              value={ this.state.emotions[emotion] }
              min={0} 
              max={10} 
              step={1} 
              vertical={true} 
              defaultValue={this.state.emotions[emotion]}
              onChange={ (val) => { this.handleSliderChange(val, emotion) } }>
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