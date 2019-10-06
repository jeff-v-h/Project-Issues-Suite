import React from 'react';
import { func, string, bool } from 'prop-types';
import { Form, Popup, Icon } from 'semantic-ui-react';

import { allowedCharsMsg } from '../../../helpers/utils';

TicketFormSection.propTypes = {
  handleChange: func.isRequired,
  project: string.isRequired,
  nameError: bool.isRequired
};

function TicketFormSection({ handleChange, project, nameError }) {
  return (
    <div className="auto-center">
      <Form.Input label="* Name" name="name" onChange={handleChange} error={nameError}>
        <input />
        <Popup content={allowedCharsMsg} trigger={
          <Icon name="info" className="char-icon"/>} />
      </Form.Input>
      <Form.TextArea label="Description" name="description" onChange={handleChange}/>
      <Form.Input label="* Project" name="project" value={project} readOnly/>
    </div>
  );
}

export default TicketFormSection;
