import React from 'react';
import { array, func } from 'prop-types';
import { Menu } from 'semantic-ui-react';

TicketList.propTypes = {
  tickets: array.isRequired,
  redirectToTicket: func.isRequired
};

function TicketList({ tickets, redirectToTicket }) {
  return (
    tickets.map((ticket, index) =>
      <Menu.Item name={ticket.name}
        key={index}
        content={ticket.name}
        onClick={redirectToTicket(ticket)} />
  )
  );
}

export default TicketList;
