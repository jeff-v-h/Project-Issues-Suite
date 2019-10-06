import React from 'react';
import { string, func } from 'prop-types';
import { Link } from 'react-dom';
import { Button, Grid } from 'semantic-ui-react';

import { routeCodes } from '../../config/constants';

MobileNewBtnsRow.propTypes = {
  unfavFunction: func,
  projectName: string
};

function MobileNewBtnsRow({ unfavFunction, projectName }) {
  return (
    <Grid.Row only="mobile">
      <Grid.Column width={4}>
        <div className="centered">
          <Button color="yellow" icon="favorite" onClick={unfavFunction} circular />
        </div>
      </Grid.Column>
      <Grid.Column width={7}>
        <Button primary as={Link} className="new-btn-mobile"
          to={'/' + projectName  + routeCodes.NEW_TICKET}>
          New Ticket
        </Button>
      </Grid.Column>
    </Grid.Row>
  );
}

export default MobileNewBtnsRow;
