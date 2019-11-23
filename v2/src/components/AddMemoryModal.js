import React,  { Component } from 'react';
import ReactModal from 'react-modal';
import { emotions } from '../constants/constants';
import styled from 'styled-components';

ReactModal.setAppElement('#root');

class AddMemoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }
  render() {
    console.log(this.props.isOpen);
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        role="dialog"
        contentLabel="Add new memory modal"
        style={ModalStyles}
      >
        <div>Hello</div>
        <button onClick={ this.props.toggleAddModal }>Close</button>
      </ReactModal>
    )
  }
}

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