import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object } from 'prop-types';
import toastr from 'toastr';
import { Container, Form, Header, Button } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

import PageHeader from '../common/PageHeader';
import { createTicket, createTicketWithVideos } from '../../actions/tickets-actions';
import { getProjectsList } from '../../actions/projects-actions';
import { videoLimits } from '../../config/constants';
import TicketFormSection from './TicketFormSection';
import NewVideoForm from '../videos/NewVideoForm';
import {
  getErrorMsg,
  getThumbnailUrl,
  nameCheck,
  encodeUrlComponent
} from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  tickets: object.isRequired,
  history: object.isRequired,
  users: object.isRequired,
  projects: object.isRequired
};

class NewTicketContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: window.location.pathname.split('/')[1],
      name: '',
      description: '',
      videoDataList: [],
      nameError: false,
      titleError: false
    };

    // Get project list asynchronously
    if (this.props.projects.data.length < 1) this.props.actions.getProjectsList()
      .catch(() => toastr.error('An error occurred while trying to get project data'));
  }

  handleSubmit = e => {
    e.preventDefault();

    const ticketName = this.state.name.trim();

    if (nameCheck.isAllowed(ticketName)) {
      this.setState({ nameError: true });
      toastr.error(nameCheck.errorMsg);
      return;
    }

    // Check the project exists and the ticket name does not exist for the given project
    // Submit button is already to be unactionable when the api request is occurring
    const project = this.props.projects.data.find(p => p.name == this.state.project);
    if (typeof project == 'undefined') {
      toastr.error('Project does not exist. Please make sure it was entered correctly in the url');
    } else if (project.tickets.some(
      t => t.name.toUpperCase() == ticketName.toUpperCase())) {
      this.setState({ nameError: true });
      toastr.error(`Name '${ticketName}' already exists for project '${project.name}'`);
    }

    if (this.state.videoDataList.length > 0) this.submitWithVideos();
    else this.submitWithoutVideos();
  }

  submitWithVideos = () => {
    const { actions, history } = this.props;
    const state = this.state;
    // Video file binary cannot be sent as json (unless in base64 string), so send as form-data
    const formData = new FormData();
    let totalSize = 0;

    for (let i = 0; i < state.videoDataList.length; i++) {
      const videoData = state.videoDataList[i];
      const videoInputFiles = document.getElementById(videoData.fileInputId).files;

      if (nameCheck.isAllowed(videoData.title)) {
        this.setState({ titleError: true });
        toastr.error(nameCheck.errorMsg);
        return;
      }

      // Make sure a video has been selected for upload
      if (videoInputFiles.length < 1) {
        toastr.error('Select video file or remove section');
        return;
      }

      if (videoInputFiles[0].size > videoLimits.SIZE) {
        toastr.error(videoLimits.MESSAGE);
        return;
      }

      // Make sure the total video size is not too big
      totalSize += videoInputFiles[0].size;
      if (totalSize > videoLimits.SIZE_TOTAL) {
        toastr.error(videoLimits.MESSAGE_TOTAL);
        return;
      }

      // Add each video file to the same property name in the form data
      formData.append('VideoFiles', videoInputFiles[0], videoData.title.trim());
      formData.append('VideoThumbnails', videoData.thumbnail);
    }

    formData.append('Name', state.name.trim());
    formData.append('Description', state.description);
    formData.append('ProjectName', state.project);
    formData.append('Creator', this.props.users.data.displayName);

    actions.createTicketWithVideos(formData).then(() => {
      // projects list in store will need to be updated due to new ticket
      actions.getProjectsList();
      toastr.success(`Ticket created`);
      history.push('/' + encodeUrlComponent(state.project) + '/'
        + encodeUrlComponent(state.name.trim()));
    }).catch(err => toastr.error(getErrorMsg(err)));
  }

  submitWithoutVideos = () => {
    const { actions, history } = this.props;
    const state = this.state;
    // If no video to be uploaded with ticket, a simple json object can be sent
    const newTicket = {
      name: state.name.trim(),
      description: state.description,
      projectName: state.project,
      videos: [],
      creator: this.props.users.data.displayName.trim()
    };

    actions.createTicket(newTicket).then(() => {
      // projects list in store will need to be updated due to new ticket
      actions.getProjectsList();
      toastr.success(`Ticket created`);
      history.push('/' + encodeUrlComponent(state.project) + '/'
        + encodeUrlComponent(state.name.trim()));
    }).catch(err => toastr.error(getErrorMsg(err)));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleTitleChange = e => {
    const video = this.state.videoDataList.find(vid => vid.titleInputName == e.target.name);
    video.title = e.target.value;

    this.setState(prevState => ({
      videoDataList: prevState.videoDataList.map(
        vid => vid.titleInputName == video.titleInputName ? video : vid
      )
    }));
  }

  addVideo = () => {
    return e => {
      e.preventDefault();

      const count = this.state.videoDataList.length;
      // Create object with reference to it's associated names and ids.
      const newVideo = {
        titleInputName: 'titleInput' + count.toString(),
        title: '',
        fileInputId: 'videoInput' + count.toString(),
        nameDivId: 'videoName' + count.toString(),
        filename: '',
        videoEleId: 'videoEle' + count.toString(),
        canvasEleId: 'canvasEle' + count.toString(),
        thumbnail: ''
      };

      this.setState(prevState => ({
        videoDataList: [...prevState.videoDataList, newVideo]
      }));
    };
  }

  // Remove all video data and input fields
  removeAllVideos = () => {
    return e => {
      e.preventDefault();
      this.setState({ videoDataList: [] });
    };
  }

  // When a video has been selected for upload, show the filename preview a thumbnail image
  handleSelect = videoData => {
    return () => {
      const files = document.getElementById(videoData.fileInputId).files[0];
      const videoElement = document.getElementById(videoData.videoEleId);
      const canvasElement = document.getElementById(videoData.canvasEleId);
      const url = URL.createObjectURL(files);

      // Set the time of the video for thumbnail to extract image from
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.currentTime = videoElement.duration / 2;
      });

      // Only make thumbnail after video has loaded data
      videoElement.addEventListener('loadeddata', () => {
        const imageBase64 = getThumbnailUrl(videoElement, canvasElement);

        videoData.filename = files.name;
        videoData.thumbnail = imageBase64;

        // Have the videoData object replace itself with the filename and image string attached
        this.setState(prevState => ({
          videoDataList: prevState.videoDataList.map(
            vid => vid.fileInputId == videoData.fileInputId ? videoData : vid
          )
        }));
      });

      // Load the video files
      videoElement.preload = 'metadata';
      videoElement.src = url;
    };
  }


  render() {
    const isTicketLoading = this.props.tickets.inProgress;
    const isProjectLoading = this.props.projects.inProgress;

    return (
      <Container>
        <Helmet>
          <title>New Ticket</title>
        </Helmet>
        <PageHeader title="New Ticket" isLoading={isTicketLoading}/>
        <div className="mid-container">
          <Form onSubmit={this.handleSubmit} className="align-left">
            <TicketFormSection project={this.state.project}
              handleChange={this.handleChange}
              inProgress={this.props.tickets.inProgress}
              nameError={this.state.nameError} />
            {this.state.videoDataList.length > 0 &&
              <div>
                <Header as="h2" className="align-center">Video</Header>
                {this.state.videoDataList.map((videoData, i) => {
                  return (
                    <NewVideoForm key={i}
                      handleChange={this.handleTitleChange}
                      videoData={videoData}
                      handleSelect={this.handleSelect}
                      isLoading={isTicketLoading}
                      titleError={this.state.titleError} />
                  );
                })}
                <div className="float-left">
                  <Button color="red" onClick={this.removeAllVideos()}
                    disabled={isTicketLoading}>Remove All</Button>
                </div>
              </div>}
            <div className="align-right">
              <Button onClick={this.addVideo()} disabled={isTicketLoading} color="blue">
                Add Video
              </Button>
              <Button color="blue" type="submit" loading={isTicketLoading || isProjectLoading}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}

NewTicketContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  tickets: state.tickets,
  users: state.users,
  projects: state.projects
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    createTicket, getProjectsList, createTicketWithVideos }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewTicketContainer));
