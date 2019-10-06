import React from 'react';
import { string } from 'prop-types';
import { Header, Grid } from 'semantic-ui-react';

TableHeaders.propTypes = {
  header1: string.isRequired,
  header2: string
};

function TableHeaders({ header1, header2 }) {
  return (
    <Grid.Row floated="left">
      <Grid.Column width={4}>
        <Header as="h3" className="project-header">{header1}</Header>
      </Grid.Column>
      <Grid.Column width={7}>
        <Header as="h3" className="ticket-header">{header2}</Header>
      </Grid.Column>
      <Grid.Column width={3} only="computer tablet"/>
    </Grid.Row>
  );
}

export default TableHeaders;
