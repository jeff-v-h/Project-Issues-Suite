import React from 'react';
import { bool, func, string, node } from 'prop-types';
import { Modal, Button, Header } from 'semantic-ui-react';

DeleteModal.propTypes = {
  show: bool.isRequired,
  showModal: func.isRequired,
  hideModal: func.isRequired,
  btnFunction: func.isRequired,
  inProgress: bool,
  message: string,
  children: node
};

DeleteModal.defaultProps = {
  inProgress: false,
  message: "Are you sure you want to delete?"
};

function DeleteModal({
  show, showModal, hideModal, btnFunction, inProgress, message, children }) {
  return (
    <Modal onClose={hideModal} open={show} basic size="tiny"
      trigger={
        <Button onClick={showModal} negative disabled={inProgress}>Delete</Button>
      }>
      <Header icon="trash alternate" content="Delete" />
      <Modal.Content>
        {children}
        <p>{message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" loading={inProgress} onClick={btnFunction}>
          Delete
        </Button>
        <Button onClick={hideModal} disabled={inProgress}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteModal;
