import React from "react";
import toastr from "toastr";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { object, array, bool, func } from "prop-types";
import { Dropdown, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { getProjectsList, selectProject } from "../../actions/projects-actions";
import { updateUser } from "../../actions/user-actions";
import FavButton from "../common/FavButton";
import {
  getProjectsForDropdown,
  getTicketsForDropdown
} from "../../../helpers/utils";
import {
  routeCodes,
  EmptyDiv,
  EmptyDiv125px,
  MidDivWrapper
} from "../../config/constants";

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired,
  users: object.isRequired,
  showTickets: bool.isRequired,
  ddProjects: array.isRequired,
  setTickets: func.isRequired
};

class ProjectDropdownContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const { actions, projects } = props;
    if (projects.data.length < 1) actions.getProjectsList();
  }

  changeProject = (e, { value }) => {
    this.setState({ showVideos: false });
    const { actions, projects, setTickets } = this.props;

    const project = projects.data.find(x => x.name == value);
    // update the selected project in the redux store
    actions.selectProject(project);

    // update state to show tickets of this project
    setTickets(getTicketsForDropdown(project.tickets));
  };

  favouriteProject = () => {
    const user = Object.assign({}, this.props.users.data);
    const project = this.props.projects.selected;

    user.favProjects.push({
      id: project.id,
      name: project.name
    });

    this.props.actions
      .updateUser(user.signinName, user)
      .then(() =>
        toastr.success(`'${project.name}' project saved to your favourites.`)
      )
      .catch(() => toastr.error("Error: save to favourites unsuccessful."));
  };

  unfavouriteProject = () => {
    const user = this.props.users.data;
    const project = this.props.projects.selected;

    // remove project from users favourites
    user.favProjects = user.favProjects.filter(p => p.name !== project.name);

    this.props.actions
      .updateUser(user.signinName, user)
      .then(() =>
        toastr.success(
          `Project '${project.name}' removed from your favourites.`
        )
      )
      .catch(() =>
        toastr.error("Error with removing project from favourites.")
      );
  };

  isProjectFavourited = () => {
    const { users, projects } = this.props;
    return (
      users.data.favProjects &&
      users.data.favProjects.find(p => p.id == projects.selected.id)
    );
  };

  render() {
    return (
      <div className="browse-input-container">
        <EmptyDiv125px />
        <MidDivWrapper>
          <div className="browse-fav-btn">
            {this.props.showTickets && (
              <FavButton
                isFavourited={this.isProjectFavourited()}
                favFunction={this.favouriteProject}
                unFavFunction={this.unfavouriteProject}
              />
            )}
          </div>
          <Dropdown
            placeholder="Select Project"
            options={this.props.ddProjects}
            onChange={this.changeProject}
            selection
          />
          <EmptyDiv />
        </MidDivWrapper>
        <div className="browse-ticket-btn">
          {this.props.showTickets && (
            <Button
              as={Link}
              primary
              to={this.props.projects.selected.name + routeCodes.NEW_TICKET}
            >
              New Ticket
            </Button>
          )}
        </div>
      </div>
    );
  }
}

ProjectDropdownContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  projects: state.projects,
  users: state.users,
  ddProjects: getProjectsForDropdown(state.projects.data)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getProjectsList,
      selectProject,
      updateUser
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDropdownContainer);
