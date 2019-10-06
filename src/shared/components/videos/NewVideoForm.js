import React from 'react';
import { func, object, bool } from 'prop-types';
import { Form, Button, Popup, Icon } from 'semantic-ui-react';

import { allowedCharsMsg } from '../../../helpers/utils';

NewVideoForm.propTypes = {
  handleChange: func.isRequired,
  handleSelect: func.isRequired,
  videoData: object.isRequired,
  isLoading: bool.isRequired,
  titleError: bool.isRequired
};

function NewVideoForm({
  handleChange, handleSelect, videoData, isLoading, titleError }) {
  return (
    <div className="auto-center">
      <Form.Input label="* Title" name={videoData.titleInputName}
        onChange={handleChange} error={titleError}>
        <input />
        <Popup content={allowedCharsMsg} trigger={
          <Icon name="info" className="char-icon"/>} />
      </Form.Input>
      <div className="select-container">
        <div className="float-left">
          <Button color="blue" as="label" htmlFor={videoData.fileInputId} disabled={isLoading}>
            Select file to upload
          </Button>
          <div id={videoData.nameDivId}>
            {videoData.filename.length > 0
            ? videoData.filename
            : ".mov and .mp4 files only"}
          </div>
        </div>
        <canvas id={videoData.canvasEleId} width="0" height="0" className="float-right" />
        <video id={videoData.videoEleId} className="invisible" />
        <input type="file" id={videoData.fileInputId} onChange={handleSelect(videoData)}
          accept=".mov,.mp4" className="invisible" />
      </div>
    </div>
  );
}

export default NewVideoForm;
