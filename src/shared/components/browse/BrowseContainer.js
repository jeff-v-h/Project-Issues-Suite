import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

import { selectVideo } from '../../actions/tickets-actions';
import { routeCodes } from '../../config/constants';
import { store } from '../../config/store';
import VideoSection from '../common/VideoSection';
import PageHeader from '../common/PageHeader';
import ProjectDropdownContainer from './ProjectDropdownContainer';
import TicketDropdownContainer from './TicketDropdownContainer';
import { encodeUrlComponent } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  projects: object.isRequired,
  tickets: object.isRequired,
  users: object.isRequired,
  history: object.isRequired
};

class BrowseContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ddTickets: [],
      videos: [],
      showTickets: false,
      showVideos: false
    };

    // When the redux store is updated, the function inside is called
    // This is used since videos are embedded within tickets object rather than it's own object
    this.unsubscribe = store.subscribe(() => {
        this.setState({
          videos: store.getState().tickets.selected.videos
        });
      });
  }

  // Unsubscribe to redux store to prevent memory leak
  componentWillUnmount() {
    this.unsubscribe();
  }

  redirectToVideo = (videoRef) => {
    return () => {
      const { actions, tickets, history, projects } = this.props;
      const video = this.state.videos.find(vid => vid.id == videoRef.id);

      actions.selectVideo(video);

      history.push('/' + encodeUrlComponent(projects.selected.name) + '/'
        + encodeUrlComponent(tickets.selected.name) + '/' +
        encodeUrlComponent(video.title));
    };
  }

  setTickets = ddTickets => {
    this.setState({ ddTickets: ddTickets, showTickets: true, showVideos: false });
  }

  setShowVideos = bool => {
    this.setState({ showVideos: bool });
  }

  getPathToNewVideo = () => {
    const { projects, tickets } = this.props;
    return '/' + encodeUrlComponent(projects.selected.name) + '/'
      + encodeUrlComponent(tickets.selected.name) + routeCodes.NEW_VIDEO;
  }

  isLoading() {
    return this.props.projects.inProgress ||
      this.props.tickets.inProgress ||
      this.props.users.inProgress;
  }

  render() {
    const { showTickets, showVideos, ddTickets, videos } = this.state;
    const { tickets } = this.props;

    return (
      <Container>
        <Helmet>
          <title>Browse</title>
        </Helmet>
        <PageHeader title="Browse" isLoading={this.isLoading()} />
        <ProjectDropdownContainer showTickets={showTickets} setTickets={this.setTickets} />
        {showTickets && (
          <div className="wide-mid-container">
            <TicketDropdownContainer showTickets={showTickets}
              showVideos={showVideos}
              ddTickets={ddTickets}
              setShowVideos={this.setShowVideos} />
            {showVideos &&
              <VideoSection videos={videos}
                pathToNewVideo={this.getPathToNewVideo()}
                redirectToVideo={this.redirectToVideo}
                status={tickets.selected.status} />}
          </div>
        )}
      </Container>
    );
  }
}

BrowseContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  projects: state.projects,
  tickets: state.tickets,
  users: state.users
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ selectVideo }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BrowseContainer));
