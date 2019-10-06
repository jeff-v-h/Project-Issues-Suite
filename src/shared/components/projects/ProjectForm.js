import React from 'react';
import { string, func, bool } from 'prop-types';
import { Form, Button, Popup, Icon } from 'semantic-ui-react';

import { allowedCharsMsg } from '../../../helpers/utils';

ProjectForm.propTypes = {
  handleSubmit: func.isRequired,
  handleNameChange: func.isRequired,
  currentName: string,
  inProgress: bool,
  nameError: bool,
  isChanged: bool
};

ProjectForm.defaultProps = {
  inProgress: false
};

function ProjectForm({
  handleSubmit, handleNameChange, currentName, inProgress, nameError, isChanged }) {
  return (
    <div className="mid-container">
      <Form onSubmit={handleSubmit} className="align-left">
        <Form.Input label="* Name"
          defaultValue={currentName}
          onChange={handleNameChange}
          error={nameError}>
          <input />
          <Popup content={allowedCharsMsg}
            trigger={<Icon name="info" className="char-icon"/>} />
        </Form.Input>
        <div className="float-right">
          <Button color="blue"
            type="submit"
            disabled={!isChanged}
            loading={inProgress}>
            Edit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ProjectForm;
