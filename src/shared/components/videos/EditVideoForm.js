import React from 'react';
import { func, object, string, bool } from 'prop-types';
import { Form, Popup, Icon } from 'semantic-ui-react';

import { status } from '../../config/constants';
import { allowedCharsMsg } from '../../../helpers/utils';

EditVideoForm.propTypes = {
  video: object.isRequired,
  handleSubmit: func.isRequired,
  updateVideoState: func.isRequired,
  ticketStatus: string.isRequired,
  titleError: bool.isRequired
};

function EditVideoForm({
  video, handleSubmit, updateVideoState, ticketStatus, titleError }) {
  const isClosed = ticketStatus === status.CLOSED;

  return (
    <div className="auto-center">
      <Form onSubmit={handleSubmit} id="edit-form" className="align-left">
        <Form.Input label="* Title" name="title" defaultValue={video.title}
          error={titleError} onChange={updateVideoState} readOnly={isClosed}>
          <input />
          <Popup content={allowedCharsMsg} trigger={
            <Icon name="info" className="char-icon"/>} />
        </Form.Input>
      </Form>
    </div>
  );
}

export default EditVideoForm;
