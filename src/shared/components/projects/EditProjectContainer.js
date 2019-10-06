import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import toastr from 'toastr';
import { withRouter } from 'react-router-dom';

import PageHeader from '../common/PageHeader';
import ProjectForm from './ProjectForm';
import {
  updateProject,
  getProject,
  selectProject,
  getProjectsList
} from '../../actions/projects-actions';
import { routeCodes } from '../../config/constants';
import { nameCheck } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired,
  history: object.isRequired
};

class EditProjectContainer extends React.Component {
  constructor(props) {
    super(props);

    const name = window.location.pathname.split('/')[1];
    const selectedProject = props.projects.selected;

    if (!selectedProject.hasOwnProperty('name') ||
      selectedProject.name != name) {
      // check if the project exists when accessed via url
      const project = props.projects.data.find(p => p.name == name);

      // If not found in redux store, try to find in database
      if (typeof project == 'undefined') {
        props.actions.getProject(name)
          .catch(() => toastr.error(`Project '${name}' could not be found in the database.`));
      } else {
        props.actions.selectProject(project);
      }
    }

    this.state = {
      name: '',
      projectUpdated: false,
      nameError: false,
      isChanged: false
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { actions, projects, history } = this.props;
    const project = Object.assign({}, projects.selected);

    if (nameCheck.isAllowed(this.state.name)) {
      this.setState({ nameError: true });
      toastr.error(nameCheck.errorMsg);
      return;
    }

    if (projects.data.some(p => p.name.toUpperCase() == name.toUpperCase())) {
      this.setState({ nameError: true });
      toastr.error(`Name '${name}' already exists`);
      return;
    }

    const oldName = project.name;
    project.name = this.state.name.trim();

    actions.updateProject(projects.selected.name, project)
      .then(()=> {
        actions.getProjectsList().catch(() => toastr.error('error updating project list'));
        toastr.success(`Project '${oldName}' renamed to '${project.name}'.`);
        history.push(routeCodes.MANAGE_PROJECTS);
      }).catch(error => toastr.error(error));
  }

  handleNameChange = e => {
    this.setState({ name: e.target.value }, () => {
      if (this.state.name == this.props.projects.selected.name) {
        this.setState({ isChanged: false });
      } else if (this.state.isChanged == false) {
        this.setState({ isChanged: true });
      }
    });
  }

  render() {
    const { projects } = this.props;
    return (
      <div className="container">
        <PageHeader title="Edit Project" isLoading={projects.inProgress}/>
        <ProjectForm currentName={projects.selected.name}
          handleSubmit={this.handleSubmit}
          handleNameChange={this.handleNameChange}
          inProgress={projects.inProgress}
          nameError={this.state.nameError}
          isChanged={this.state.isChanged} />
      </div>
    );
  }
}

EditProjectContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    updateProject,
    getProject,
    selectProject,
    getProjectsList }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProjectContainer));
