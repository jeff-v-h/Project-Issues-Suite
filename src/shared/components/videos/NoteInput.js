import React from 'react';
import { func, object, string, bool } from 'prop-types';
import { Input, Button } from 'semantic-ui-react';

import { status } from '../../config/constants';

NoteInput.propTypes = {
  inputRef: object.isRequired,
  onClick: func.isRequired,
  ticketStatus: string.isRequired,
  disabled: bool.isRequired,
  noteInputError: bool
};

function NoteInput({ inputRef, onClick, ticketStatus, disabled, noteInputError }) {
  let isDisabled = false;
  if (ticketStatus == status.CLOSED || disabled) {
    isDisabled = true;
  }

  return (
    <Input ref={inputRef} action placeholder="Pause the video and write a note..."
      readOnly={isDisabled} error={noteInputError}>
        <input />
        <Button color="grey" onClick={onClick} disabled={isDisabled}>Add Note</Button>
    </Input>
  );
}

export default NoteInput;
