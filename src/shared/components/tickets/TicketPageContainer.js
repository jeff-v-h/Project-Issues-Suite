import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { object } from "prop-types";
import toastr from "toastr";
import { Container, Button } from "semantic-ui-react";
import { Helmet } from "react-helmet";

import PageHeader from "../common/PageHeader";
import EditTicketForm from "./EditTicketForm";
import VideoSection from "../common/VideoSection";
import DeleteModal from "../common/DeleteModal";
import { routeCodes, roles } from "../../config/constants";
import {
  getTicketByName,
  updateTicket,
  deleteTicket,
  selectTicket,
  selectVideo
} from "../../actions/tickets-actions";
import { getProjectsList } from "../../actions/projects-actions";
import { updateUser } from "../../actions/user-actions";
import FavButton from "../common/FavButton";
import {
  encodeUrlComponent,
  decodeUrlComponent,
  getPath,
  nameCheck
} from "../../../helpers/utils";
import Page404 from "../globals/404/Page404";

const propTypes = {
  actions: object.isRequired,
  tickets: object.isRequired,
  users: object.isRequired,
  history: object.isRequired,
  location: object.isRequired,
  projects: object.isRequired
};

class TicketPageContainer extends React.Component {
  constructor(props) {
    super(props);

    const ticket = props.tickets.selected;
    const urlParts = getPath().split("/");
    let notFound = false;

    // When url is accessed directly, ensure there is a selected ticket in the redux store
    if (!ticket.hasOwnProperty("id")) {
      const ticketName = decodeUrlComponent(urlParts[2]);
      const projectName = decodeUrlComponent(urlParts[1]);
      props.actions
        .getTicketByName(projectName, ticketName)
        .catch(() => this.setNotFound());
    }

    this.state = {
      ticket: Object.assign({}, ticket),
      showModal: false,
      detailsChanged: false,
      nameError: false,
      notFound: notFound
    };
  }

  // Necessary to populate form when url accessed directly to ensure state is updated properly
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.ticket.id != nextProps.tickets.selected.id) {
      return { ticket: Object.assign({}, nextProps.tickets.selected) };
    } else {
      return null;
    }
  }

  setNotFound = () => this.setState({ notFound: true });

  handleSubmit = e => {
    e.preventDefault();
    const { actions, tickets } = this.props;
    const ticket = Object.assign({}, this.state.ticket);
    const project = this.props.projects.data.find(
      p => p.name == ticket.projectName
    );

    if (nameCheck.isAllowed(ticket.name)) {
      this.setState({ nameError: true });
      toastr.error(nameCheck.errorMsg);
      return;
    }

    ticket.name = ticket.name.trim();

    // Check the ticket name does not exist for the given project
    // Only need to check if the name has changed
    const nameChanged = ticket.name != tickets.selected.name;
    const nameExists = project.tickets.some(
      t => t.name.toUpperCase() == ticket.name.toUpperCase()
    );
    if (nameChanged && nameExists) {
      this.setState({ nameError: true });
      toastr.error(
        `Name '${ticket.name}' already exists for project '${project.name}'`
      );
      return;
    }

    actions
      .updateTicket(ticket)
      .then(() => {
        // If ticket name has changed, refresh project list and update url
        if (tickets.selected.name !== ticket.name) {
          actions.getProjectsList();

          // Also need to update user if the ticket is favourited
          if (this.isFavourite()) this.updateUserFavTicket();

          this.props.history.push(
            "/" +
              encodeUrlComponent(project.name) +
              "/" +
              encodeUrlComponent(ticket.name)
          );
        }

        this.setState({ detailsChanged: false });
        toastr.success("Ticket updated");
      })
      .catch(err => toastr.error(err));
  };

  // Update the user's favourite tickets
  updateUserFavTicket = () => {
    const user = Object.assign({}, this.props.users.data);
    const newTicketBase = {
      id: this.state.ticket.id,
      name: this.state.ticket.name
    };

    user.favTickets = user.favTickets.map(ticketBase =>
      ticketBase.id == newTicketBase.id ? newTicketBase : ticketBase
    );

    this.props.actions.updateUser(user.signinName, user);
  };

  // Return a function to be actioned on click
  redirectToVideo = video => {
    return () => {
      this.props.actions.selectVideo(video);
      this.props.history.push(
        getPath() + "/" + encodeUrlComponent(video.title)
      );
    };
  };

  updateTicketState = e => {
    if (!this.state.detailsChanged) {
      this.setState({ detailsChanged: true });
    }
    const field = e.target.name;
    const ticket = Object.assign({}, this.state.ticket);
    ticket[field] = e.target.value;
    return this.setState({ ticket });
  };

  handleSelectDropdown = (e, { value }) => {
    if (!this.state.detailsChanged) {
      this.setState({ detailsChanged: true });
    }
    const ticket = Object.assign({}, this.state.ticket);
    ticket["status"] = value;
    return this.setState({ ticket });
  };

  favouriteTicket = () => {
    const user = this.props.users.data;
    const ticket = this.props.tickets.selected;

    // add a reference to the ticket to the user's favTickets
    user.favTickets.push({ id: ticket.id, name: ticket.name });

    this.props.actions
      .updateUser(user.signinName, user)
      .then(() =>
        toastr.success(`Ticket '${ticket.name}' saved to your favourites.`)
      )
      .catch(() => toastr.error("Error: saved to favourites unsuccessful."));
  };

  unfavouriteTicket = () => {
    const user = this.props.users.data;
    const ticket = this.props.tickets.selected;

    // remove ticket from favourites
    user.favTickets = user.favTickets.filter(obj => obj.id !== ticket.id);

    this.props.actions
      .updateUser(user.signinName, user)
      .then(() =>
        toastr.success(`Ticket '${ticket.name}' removed from your favourites.`)
      )
      .catch(() => toastr.error("Error with removing ticket from favourites."));
  };

  deleteTicket = () => {
    const { actions, tickets, history } = this.props;

    actions
      .deleteTicket(tickets.selected.id)
      .then(() => {
        // clear redux project list so the updated list can be obtained
        actions.getProjectsList();
        toastr.success(`Ticket deleted.`);
        history.push(routeCodes.DASHBOARD);
      })
      .catch(error => {
        this.hideDeleteModal();
        toastr.error(error.response.data);
      });
  };

  showDeleteModal = () => this.setState({ showModal: true });
  hideDeleteModal = () => this.setState({ showModal: false });

  isLoading() {
    return this.props.tickets.inProgress || this.props.users.inProgress;
  }

  isFavourite = () => {
    const { tickets, users } = this.props;

    // if the ticket is in the users favTickets array, return true
    return users.data.favTickets.some(obj => obj.id === tickets.selected.id);
  };

  render() {
    const state = this.state;
    const reduxTickets = this.props.tickets;
    const msg =
      "Are you sure you want to delete this ticket and ALL it's videos?";

    if (state.notFound) return <Page404 />;

    return (
      <Container>
        <Helmet>
          <title>Ticket</title>
        </Helmet>
        <PageHeader title="Ticket" isLoading={this.isLoading()} />
        {state.ticket.hasOwnProperty("id") && (
          <div className="mid-container">
            <EditTicketForm
              ticket={state.ticket}
              handleSubmit={this.handleSubmit}
              updateTicketState={this.updateTicketState}
              showDeleteModal={this.showDeleteModal}
              detailsChanged={state.detailsChanged}
              handleSelect={this.handleSelectDropdown}
              nameError={this.state.nameError}
            />
            <div className="big-auto-center">
              <div className="float-left">
                <FavButton
                  isFavourited={this.isFavourite()}
                  favFunction={this.favouriteTicket}
                  unFavFunction={this.unfavouriteTicket}
                  disabled={reduxTickets.inProgress}
                />
              </div>
              <div className="align-right">
                <Button
                  form="edit-form"
                  color="blue"
                  loading={reduxTickets.inProgress}
                  disabled={!state.detailsChanged}
                >
                  Edit
                </Button>
                {/* {this.props.users.data.role == roles.ADMIN && */}
                <DeleteModal
                  show={state.showModal}
                  btnFunction={this.deleteTicket}
                  inProgress={reduxTickets.inProgress}
                  showModal={this.showDeleteModal}
                  hideModal={this.hideDeleteModal}
                  message={msg}
                />
                {/* } */}
              </div>
            </div>
            <VideoSection
              videos={state.ticket.videos}
              pathToNewVideo={getPath() + routeCodes.NEW_VIDEO}
              redirectToVideo={this.redirectToVideo}
              status={reduxTickets.selected.status}
              disabled={reduxTickets.inProgress}
            />
          </div>
        )}
      </Container>
    );
  }
}

TicketPageContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  tickets: state.tickets,
  users: state.users,
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getTicketByName,
      updateTicket,
      deleteTicket,
      selectTicket,
      selectVideo,
      getProjectsList,
      updateUser
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TicketPageContainer)
);
