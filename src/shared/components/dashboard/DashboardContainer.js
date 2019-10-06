import React from 'react';
import { connect } from 'react-redux';
import { object } from 'prop-types';
import { Helmet } from 'react-helmet';

import FavProjectsContainer from './FavProjectsContainer';
import FavTicketsContainer from './FavTicketsContainer';
import PageHeader from '../common/PageHeader';

const propTypes = {
  projects: object.isRequired,
  tickets: object.isRequired,
  users: object.isRequired
};

class DashboardContainer extends React.Component {
  isLoading() {
    return this.props.projects.inProgress||
      this.props.tickets.inProgress ||
      this.props.users.inProgress;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <PageHeader title="Dashboard" isLoading={this.isLoading()} />
        <FavProjectsContainer />
        <FavTicketsContainer />
      </div>
    );
  }
}

DashboardContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects,
  tickets: state.tickets,
  users: state.users
});

export default connect(mapStateToProps)(DashboardContainer);
