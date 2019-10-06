import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import { Header, Container } from 'semantic-ui-react';
import toastr from 'toastr';

import { getProjectsList, selectProject } from '../../actions/projects-actions';
import { getTicket, selectTicket } from '../../actions/tickets-actions';
import { updateUser } from '../../actions/user-actions';
import CardList from '../common/CardList';
import { encodeUrlComponent } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired,
  tickets: object.isRequired,
  users: object.isRequired,
  history: object.isRequired
};

class FavTicketsContainer extends React.Component{
  redirectToTicket = (ticketRef) => {
    return e => {
      e.preventDefault();
      const { actions, tickets, history } = this.props;
      // Find ticket by id since name can be changed
      const ticket = tickets.data.find(x => x.id == ticketRef.id);

      // Check to see if ticket was in the redux store
      if (typeof ticket !== 'undefined') {
        // Make the clicked ticket the selected ticket in the store if it isnt already
        if (ticket.id != tickets.selected.id) actions.selectTicket(ticket);

        const encodedTicketName = encodeUrlComponent(ticket.name);
        history.push('/' + encodeUrlComponent(ticket.projectName) + '/' + encodedTicketName);
      } else {
        actions.getTicket(ticketRef.id).then(() => {
          // Tickets changed so get the tickets prop again
          const { users, tickets } = this.props;
          const ticketName = tickets.selected.name;

          // If the ticket name was changed, update the name in user favs as well
          if (ticketRef.name != ticketName) {
            const user = Object.assign({}, users.data);
            const newTicketRef = Object.assign({}, ticketRef);
            newTicketRef.name = ticketName;
            user.favTickets = user.favTickets.map(t => t.id == newTicketRef.id ? newTicketRef : t);
            actions.updateUser(user.signinName, user);
          }

          const encodedTicketName = encodeUrlComponent(ticketName);
          const encodedProjectName = encodeUrlComponent(tickets.selected.projectName);
          history.push('/' + encodedProjectName + '/' + encodedTicketName);});
      }
    };
  }

  unfavouriteTicket = (ticket) => {
    return () => {
      const { actions } = this.props;
      const user = Object.assign({}, this.props.users.data);

      // Remove ticket from user's favourites
      user.favTickets = user.favTickets.filter(obj => obj.id !== ticket.id);

      actions.updateUser(user.signinName, user)
        .then(() => toastr.success(`Ticket '${ticket.name}' removed from your favourites.`))
        .catch(() => toastr.error(`Error with removing ticket '${ticket.name}' from favourites.`));
    };
  }

  render() {
    const user = this.props.users.data;

    return (
      <Container>
        <div className="wide-mid-container big-auto-center">
          <Header as="h3">Fav Tickets</Header>
          {!this.props.projects.inProgress &&
            <div>
              {user.favProjects && user.favTickets.length > 0 ?
                <CardList tickets={user.favTickets}
                  mainBtnFunction={this.redirectToTicket}
                  circularBtnFunction={this.unfavouriteTicket} />
              : <div>No tickets favourited</div>
              }
            </div>
          }
        </div>
      </Container>
    );
  }
}

FavTicketsContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects,
  tickets: state.tickets,
  users: state.users
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getProjectsList,
    selectProject,
    getTicket,
    selectTicket,
    updateUser
  }, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FavTicketsContainer));
