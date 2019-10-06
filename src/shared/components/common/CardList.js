import React from 'react';
import { func, array } from 'prop-types';
import { Card, Button } from 'semantic-ui-react';

CardList.propTypes = {
  tickets: array.isRequired,
  mainBtnFunction: func,
  circularBtnFunction: func
};

function CardList({ tickets, mainBtnFunction, circularBtnFunction }) {
  return (
    <Card.Group itemsPerRow={3} className="align-left" stackable centered>
      {tickets.map((ticket, i) => (
        <Card key={i} raised>
          <Card.Content>
            {circularBtnFunction &&
              <Button circular
                icon="favorite"
                onClick={circularBtnFunction(ticket)}
                floated="right"
                color="yellow"
                size="mini" />
            }
            <Card.Header>{ticket.name}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            {mainBtnFunction &&
              <Button onClick={mainBtnFunction(ticket)}
                floated="right"
                color="blue">
                View
              </Button>
            }
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
}

export default CardList;
