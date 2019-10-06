import React from 'react';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object, bool, array, func } from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';

import { getTicket, selectTicket } from '../../actions/tickets-actions';
import { updateUser } from '../../actions/user-actions';
import FavButton from '../common/FavButton';
import { routeCodes, EmptyDiv, EmptyDiv125px, MidDivWrapper } from '../../config/constants';

const propTypes = {
  // Redux props
  actions: object.isRequired,
  projects: object.isRequired,
  tickets: object.isRequired,
  users: object.isRequired,
  // Parent component's (BrowseContainer's) props
  showTickets: bool.isRequired,
  showVideos: bool.isRequired,
  ddTickets: array.isRequired,
  setShowVideos: func.isRequired
};

class TicketDropdownContainer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  changeTicket = (e, {value}) => {
    const { actions, projects, tickets, setShowVideos } = this.props;
    setShowVideos(false);

    const ticketReference = projects.selected.tickets.find(x => x.name === value);
    // Try to get the video from the redux data store first
    const ticket = tickets.data.find(x => x.id === ticketReference.id);
    // Either make a GET request if not in redux store or populate from ticket in redux store
    if (typeof ticket === "undefined") {
      actions.getTicket(ticketReference.id)
        .then(() => setShowVideos(true))
        .catch(() => toastr.error("Error getting ticket"));
    } else {
      actions.selectTicket(ticket);
      setShowVideos(true);
    }
  }

  favouriteTicket = () => {
    const user = this.props.users.data;
    const ticket = this.props.tickets.selected;

    // add a reference to the ticket to the user's favTickets
    user.favTickets.push({ id: ticket.id, name: ticket.name });

    this.props.actions.updateUser(user.signinName, user)
      .then(() => toastr.success(`Ticket '${ticket.name}' saved to your favourites.`))
      .catch(() => toastr.error('Error: saved to favourites unsuccessful.'));
  }

  unfavouriteTicket = () => {
    const user = this.props.users.data;
    const ticket = this.props.tickets.selected;

    // remove ticket from favourites
    user.favTickets = user.favTickets.filter(obj => obj.id !== ticket.id);

    this.props.actions.updateUser(user.signinName, user)
      .then(() => toastr.success(`Ticket '${ticket.name}' removed from your favourites.`))
      .catch(() => toastr.error('Error with removing ticket from favourites.'));
  }

  isTicketFavourited = () => {
    const { users, tickets } = this.props;
    return users.data.favTickets.some(obj => obj.id === tickets.selected.id);
  }

  render() {
    const { projects, tickets, ddTickets, showVideos } = this.props;

    return (
      <div className="browse-input-container">
        <EmptyDiv125px />
        <MidDivWrapper>
          <div className="browse-fav-btn">
            {showVideos &&
              <FavButton isFavourited={this.isTicketFavourited()}
                favFunction={this.favouriteTicket}
                unFavFunction={this.unfavouriteTicket} />
            }
          </div>
          {ddTickets.length ?
            <Dropdown placeholder="Select Ticket"
              options={ddTickets}
              onChange={this.changeTicket}
              selection />
          : (
            <div>
              <Dropdown text="Project has no tickets" disabled />
              <div className="align-right auto-center">
                <Button as={Link} primary
                  to={'/' + projects.selected.name  + routeCodes.NEW_TICKET}>
                  New Ticket
                </Button>
              </div>
            </div>
          )}
          <EmptyDiv />
        </MidDivWrapper>
        <div className="browse-ticket-btn">
          {showVideos &&
            <Button as={Link} primary
              to={routeCodes.TICKETS + '/' + tickets.selected.id}>
              View Ticket
            </Button>
          }
        </div>
      </div>
    );
  }
}

TicketDropdownContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects,
  tickets: state.tickets,
  users: state.users
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getTicket,
    selectTicket,
    updateUser }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketDropdownContainer);
