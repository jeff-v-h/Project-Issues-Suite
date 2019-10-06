import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import { Container, Dropdown, Button } from 'semantic-ui-react';
import toastr from 'toastr';
import { Helmet } from 'react-helmet';

import PageHeader from '../common/PageHeader';
import { getProjectsList, selectProject, deleteProject } from '../../actions/projects-actions';
import { routeCodes } from '../../config/constants';
import DeleteModal from '../common/DeleteModal';
import { getProjectsForDropdown } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired
};

class ManageProjectsContainer extends React.Component {
  constructor(props) {
    super(props);

    const { actions, projects } = props;
    if (projects.data.length < 1) {
      actions.getProjectsList();
    }

    this.state = {
      showButtons: false,
      showModal: false
    };
  }

  changeProject = (e, {value}) => {
    const project = this.props.projects.data.find(x => x.name == value);
    // update the selected project in the redux store
    this.props.actions.selectProject(project);
    this.setState({ showButtons: true });
  }

  deleteProject = () => {
    const { actions, projects } = this.props;
    actions.deleteProject(projects.selected.name)
      .then(() => toastr.success(`Project '${projects.selected.name}' deleted.`))
      .catch(error => toastr.error(error));
    this.setState({ showModal: false, showButtons: false });
  }

  showDeleteModal = () => {
    this.setState({ showModal: true });
  }

  hideDeleteModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { projects } = this.props;

    return (
      <Container>
        <Helmet>
          <title>Manage Projects</title>
        </Helmet>
        <PageHeader title="Manage Projects" isLoading={projects.inProgress}/>
        <div className="auto-center">
          <Button color="blue" as={Link} content="Create New Project"
            to={routeCodes.NEW_PROJECT} />
        </div>
        <div className="mid-container auto-center">
          <Dropdown placeholder="Select Project"
            options={getProjectsForDropdown(projects.data)}
            onChange={this.changeProject}
            selection />
        </div>
        <div className="mid-container">
          {this.state.showButtons &&
            <div>
              <Button color="blue" as={Link} content="Edit"
                to={'/' + projects.selected.name + routeCodes.EDIT} />
              <DeleteModal show={this.state.showModal}
                btnFunction={this.deleteProject}
                inProgress={projects.inProgress}
                showModal={this.showDeleteModal}
                hideModal={this.hideDeleteModal}
                message={`Are you sure you want to delete
                  "${projects.selected.name}" and ALL it's tickets?`} />
            </div>
          }
        </div>
      </Container>
    );
  }
}

ManageProjectsContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getProjectsList, selectProject, deleteProject }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageProjectsContainer);
