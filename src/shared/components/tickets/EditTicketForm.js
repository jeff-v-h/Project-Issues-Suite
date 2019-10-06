import React from 'react';
import { func, object, bool } from 'prop-types';
import { Form, Popup, Icon } from 'semantic-ui-react';

import { status } from '../../config/constants';
import { allowedCharsMsg } from '../../../helpers/utils';

const options = [
  { key: 'o', text: 'Open', value: status.OPEN },
  { key: 'p', text: 'In Progress', value: status.IN_PROGRESS },
  { key: 'c', text: 'Closed', value: status.CLOSED }
];

EditTicketForm.propTypes = {
  handleSubmit: func.isRequired,
  updateTicketState: func.isRequired,
  ticket: object.isRequired,
  handleSelect: func.isRequired,
  nameError: bool
};

EditTicketForm.defaultProps = {
  nameError: false
};

function EditTicketForm({
  handleSubmit, updateTicketState, ticket, handleSelect, nameError }) {
  let isDisabled = false;
  if (ticket.status == status.CLOSED) {
    isDisabled = true;
  }

  return (
    <div className="mid-container auto-center">
      <h2>Details</h2>
      <Form onSubmit={handleSubmit} id="edit-form" className="align-left">
        <Form.Select label="* Status"
          name="status"
          value={ticket.status}
          placeholder={ticket.status}
          options={options}
          onChange={handleSelect} />
        <Form.Input label="* Id" name="id" value={ticket.id} readOnly />
        <Form.Input label="* Name" name="name" defaultValue={ticket.name}
          onChange={updateTicketState} error={nameError} readOnly={isDisabled}>
          <input />
          <Popup content={allowedCharsMsg}
            trigger={<Icon name="info" className="char-icon"/>} />
        </Form.Input>
        {isDisabled ?
          <Form.TextArea label="Description" defaultValue={ticket.description}
            readOnly className="read-only" />
        : <Form.TextArea label="Description" name="description"
            defaultValue={ticket.description} onChange={updateTicketState} />
        }
        <Form.Input label="* Project Name" name="projectName"
          value={ticket.projectName} readOnly/>
        <Form.Input label="Created By" name="creator"
          value={ticket.creator} readOnly />
      </Form>
    </div>
  );
}

export default EditTicketForm;
