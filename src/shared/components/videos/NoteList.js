import React from 'react';
import { array, func, string } from 'prop-types';
import { List, Button } from 'semantic-ui-react';

NoteList.propTypes = {
  notes: array.isRequired,
  displayTime: func.isRequired,
  btnOnClick: func.isRequired,
  seekTo: func.isRequired,
  icon: string,
  header: string
};

NoteList.defaultProps = {
  icon: 'x'
};

function NoteList({ notes, displayTime, btnOnClick, seekTo, icon, header }) {
  if (notes.length > 0) {
    return (
      <List divided className="align-left margin-bot">
        <List.Header><h4>{header}</h4></List.Header>
        {notes.map((note, i) => {
          return (
            <List.Item key={i}>
              <List.Content floated="left">
                <a onClick={seekTo(note.time)}>
                  {displayTime(note.time)} - {note.text}
                </a>
              </List.Content>
              <List.Content>
                <Button icon={icon} onClick={btnOnClick(note)} floated="right" size="mini" />
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  }
  return null;
}

export default NoteList;
