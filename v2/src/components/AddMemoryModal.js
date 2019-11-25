import React,  { Component } from 'react';
import ReactModal from 'react-modal';
import { emotions, emotions2 } from '../constants/constants';
import styled from 'styled-components';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

ReactModal.setAppElement('#root');

class AddMemoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,

      memory: '',
      isCoreMemory: false,

      joy: 0,
      anger: 0,
      sadness: 0,
      fear: 0,
      disgust: 0,
      neutral: 0

    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleSliderChange(a) {
    console.log(a);

  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ [target.name]: value })
  }

  resetForm() {
    console.log('reset!');
  }

  handleCancel() {
    this.resetForm();
    this.props.toggleAddModal(false);
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        role="dialog"
        contentLabel="Add new memory modal"
        style={ModalStyles}
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
              min={0} 
              max={10} 
              step={1} 
              vertical={true} 
              defaultValue={this.state[emotion]}
              onChange={ this.handleSliderChange }>
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
          <button>Save Memory</button>
        </div>

      </ReactModal>
    )
  }
}

const StyledSliderContainer = styled.div`
  height: 25%;
  margin: 45px 0;
`;

const StyledSlider = styled(Slider)`
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

const ModalStyles = {

}

/* it seems that React-Modal is not compatible with Styled Components
const StyledReactModal = styled(ReactModal)`
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: 'translate(-50%, -50%)';
`;
*/

export default AddMemoryModal;