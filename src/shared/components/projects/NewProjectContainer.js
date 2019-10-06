import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import toastr from 'toastr';
import { Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import PageHeader from '../common/PageHeader';
import ProjectForm from './ProjectForm';
import { createProject, getProjectsList } from '../../actions/projects-actions';
import { routeCodes } from '../../config/constants';
import { nameCheck } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired,
  history: object.isRequired
};

class NewProjectContainer extends React.Component {
  constructor(props) {
    super(props);

    const { actions, projects } = props;
    if (projects.data.length < 1) actions.getProjectsList();

    this.state = {
      name: '',
      nameError: false,
      isChanged: false
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const name = this.state.name;

    if (nameCheck.isAllowed(name)) {
      this.setState({ nameError: true });
      toastr.error(nameCheck.errorMsg);
      return;
    }

    const projects = this.props.projects.data;
    if (projects.some(p => p.name.toUpperCase() == name.toUpperCase())) {
      this.setState({ nameError: true });
      toastr.error(`Name '${name}' already exists`);
      return;
    }

    const { actions, history } = this.props;
    actions.createProject(name).then(()=> {
      toastr.success(`Project '${name}' created.`);
      history.push(routeCodes.MANAGE_PROJECTS);
    }).catch(() => toastr.error("Please provide a unique name."));
  }

  handleNameChange = e => this.setState({
    name: e.target.value,
    isChanged: true
  });

  render() {
    return (
      <Container>
        <PageHeader title="New Project" isLoading={this.props.projects.inProgress} />
        <ProjectForm handleSubmit={this.handleSubmit}
          handleNameChange={this.handleNameChange}
          inProgress={this.props.projects.inProgress}
          nameError={this.state.nameError}
          isChanged={this.state.isChanged} />
      </Container>
    );
  }
}

NewProjectContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createProject, getProjectsList }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewProjectContainer));
