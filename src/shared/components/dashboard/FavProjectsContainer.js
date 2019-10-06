import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import toastr from 'toastr';
import { Button, Grid, Menu } from 'semantic-ui-react';

import { getProjectsList, selectProject } from '../../actions/projects-actions';
import { getTicket, selectTicket } from '../../actions/tickets-actions';
import { updateUser } from '../../actions/user-actions';
import { routeCodes } from '../../config/constants';
import TableHeaders from './TableHeaders';
import MobileNewBtnsRow from './MobileNewBtnsRow';
import TicketList from './TicketList';
import ProjectList from './ProjectList';
import { encodeUrlComponent } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired,
  tickets: object.isRequired,
  users: object.isRequired,
  history: object.isRequired
};

class FavProjectsContainer extends React.Component{
  constructor(props) {
    super(props);

    // reset selected project, otherwise table may show another project's tickets
    if (props.projects.selected.hasOwnProperty('id')) props.actions.selectProject({});

    this.state = { showTickets: false };
  }

  changeProject = (projectRef) => {
    return (() => {
      const { actions, projects } = this.props;
      const project = projects.data.find(x => x.id == projectRef.id);

      // Remove the project from project favs if not found (deleted project)
      if (typeof project == 'undefined') {
        // TODO remove project from favs
        toastr.error('Project could not be found');
        return;
      }

      // Update the project name in user favs if it has been changed
      if (projectRef.name != project.name) {
        const user = Object.assign({}, this.props.users.data);
        const newProjectRef = Object.assign({}, projectRef);
        newProjectRef.name = project.name;
        user.favProjects = user.favProjects.map(
          p => p.id == newProjectRef.id ? newProjectRef : p);
        actions.updateUser(user.signinName, user);
      }

      // update the selected project in the redux store
      actions.selectProject(project);
      // update state to show tickets of this project
      this.setState({ showTickets: true });
    });
  }

  redirectToTicket = (ticketRef) => {
    return e => {
      e.preventDefault();
      const { actions, tickets, history } = this.props;
      const ticket = tickets.data.find(x => x.id == ticketRef.id);
      const ticketNameForUrl = encodeUrlComponent(ticketRef.name);

      // make sure ticket is obtained and selected in router before redirect to ticket page
      if (typeof ticket !== 'undefined') {
        // make the clicked ticket the selected ticket in the store if it isnt already
        if (ticket.id != tickets.selected.id) {
          actions.selectTicket(ticket);
        }

        history.push(
          '/' + encodeUrlComponent(ticket.projectName) + '/' + ticketNameForUrl);
      } else {
        actions.getTicket(ticketRef.id).then(() => {
          // Use the full props.tickets again since it has been updated after getTicket
          history.push('/' + encodeUrlComponent(this.props.tickets.selected.projectName)
            + '/' + ticketNameForUrl);
        });
      }
    };
  }

  unfavouriteProject = () => {
    const { actions } = this.props;
    const user = this.props.users.data;
    const project = this.props.projects.selected;

    // remove project from users favourites
    user.favProjects = user.favProjects.filter(name => name !== project.name);

    this.setState({ showTickets: false });
    actions.updateUser(user.signinName, user)
      .then(() => toastr.success(`Project '${project.name}' removed from your favourites.`))
      .catch(() => toastr.error('Error with removing project from favourites.'));
  }

  render() {
    const props = this.props;
    const selectedProject = props.projects.selected;

    return (
      <div className="wide-mid-container big-auto-center">
        <Grid centered>
          <TableHeaders header1="Fav Projects" header2="Tickets" />
          <Grid.Row>
            <Grid.Column width={4}>
              <Menu fluid vertical tabular className="table-menu">
                {!props.projects.inProgress &&
                  <div>
                    {(props.users.data.favProjects &&
                      props.users.data.favProjects.length > 0)
                    ? <ProjectList projects={props.users.data.favProjects}
                        changeProject={this.changeProject}
                        selectedProject={selectedProject}/>
                    : <Menu.Item>No projects favourited</Menu.Item>
                    }
                  </div>
                }
              </Menu>
            </Grid.Column>

            <Grid.Column width={7}>
              {this.state.showTickets &&
                <Menu fluid vertical secondary className="table-menu">
                  {selectedProject.tickets.length > 0 ? (
                    <TicketList tickets={selectedProject.tickets}
                      redirectToTicket={this.redirectToTicket} />
                  ) : (
                    <Menu.Item>{selectedProject.name} currently has no tickets.</Menu.Item>
                  )}
                </Menu>
              }
            </Grid.Column>

            <Grid.Column width={3} only="computer tablet">
              {this.state.showTickets &&
                <Button.Group vertical className="pad-right">
                  <Button color="yellow" animated="vertical" onClick={this.unfavouriteProject}>
                    <Button.Content visible>Unfavourite</Button.Content>
                    <Button.Content hidden>{selectedProject.name}</Button.Content>
                  </Button>
                  <Button primary as={Link}
                    to={'/' + selectedProject.name  + routeCodes.NEW_TICKET}>
                    New Ticket
                  </Button>
                </Button.Group>
              }
            </Grid.Column>
          </Grid.Row>

          {this.state.showTickets &&
            <MobileNewBtnsRow showTickets={this.state.showTickets}
              projectName={selectedProject.name} />
          }
        </Grid>
      </div>
    );
  }
}

FavProjectsContainer.propTypes = propTypes;

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FavProjectsContainer));
