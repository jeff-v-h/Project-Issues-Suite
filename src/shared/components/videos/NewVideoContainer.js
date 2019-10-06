import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Card, Form, Button } from 'semantic-ui-react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import { Helmet } from 'react-helmet';

import PageHeader from '../common/PageHeader';
import NewVideoForm from './NewVideoForm';
import { getTicketByName, updateTicket, updateTicketWithVideos } from '../../actions/tickets-actions';
import { videoLimits } from '../../config/constants';
import { getThumbnailUrl, nameCheck, decodeUrlComponent, getPath } from '../../../helpers/utils';

const propTypes = {
  actions: object.isRequired,
  tickets: object.isRequired,
  history: object.isRequired
};

class NewVideoContainer extends React.Component {
  constructor(props) {
    super(props);

    const path = getPath();
    // when url is accessed directly, ensure there is a selected ticket in the redux store
    if (!props.tickets.selected.hasOwnProperty('id')) {
      const urlParts = path.split('/');
      const ticketName = decodeUrlComponent(urlParts[2]);
      props.actions.getTicketByName(urlParts[1], ticketName);
    }

    this.state = {
      videoDataList: this.initialVideoDataState(),
      titleError: false,
      urlToTicket: path.substr(0, path.lastIndexOf('/'))
    };
  }

  initialVideoDataState = () => {
    return [{
      titleInputName: 'titleInput0',
      title: '',
      fileInputId: 'videoInput0',
      nameDivId: 'videoName0',
      filename: '',
      videoEleId: 'videoEle0',
      canvasEleId: 'canvasEle0',
      thumbnail: ''
    }];
  }

  // When the form submit occurs, the video array and it's meta-data will be sent to the api
  handleSubmit = e => {
    e.preventDefault();
    const state = this.state;
    const ticket = this.props.tickets.selected;
    const formData = new FormData();
    let totalSize = 0;

    for (let i = 0; i < state.videoDataList.length; i++) {
      const video = state.videoDataList[i];
      const videoInputFiles = document.getElementById(video.fileInputId).files;

      if (nameCheck.isAllowed(video.title)) {
        this.setState({ titleError: true });
        toastr.error(nameCheck.errorMsg);
        return;
      }

      // Make sure a video has been selected for upload
      if (videoInputFiles.length < 1) {
        toastr.error('Select video file for all open sections');
        return;
      }

      // Make sure the total video size is not too big
      totalSize += videoInputFiles[0].size;
      if (totalSize > videoLimits.SIZE) {
        toastr.error(videoLimits.MESSAGE);
        return;
      }

      // Add each video file and thumbnail to the same property name in the form data
      formData.append('VideoFiles', videoInputFiles[0], video.title.trim());
      formData.append('VideoThumbnails', video.thumbnail);
    }

    // Add in the same ticket details
    formData.append('Id', ticket.id);
    formData.append('Name', ticket.name);
    formData.append('Description', ticket.description);
    formData.append('ProjectName', ticket.projectName);
    formData.append('Videos', ticket.videos);
    formData.append('Status', ticket.status);

    this.props.actions.updateTicketWithVideos(ticket.id, formData)
      .then(() => {
        toastr.success(`Videos Uploaded`);
        this.props.history.push(state.urlToTicket);
      }).catch(err => {
        toastr.error(err);
      });
  }

  handleTitleChange = e => {
    const video = this.state.videoDataList.find(
      vid => vid.titleInputName == e.target.name);
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
        videoDataList: [...prevState.videoDataList, newVideo],
        count: prevState.count + 1
      }));
    };
  }

  // Remove a video input section based on given input id
  removeAllVideos = () => {
    return e => {
      e.preventDefault();
      // Set it to empty first so the file input clears the reference to the selected files
      this.setState({ videoDataList: [], titleError: false }, () => {
        this.setState({ videoDataList: this.initialVideoDataState() });
      });
    };
  }

  // When a video has been selected for upload, show the filename & preview a thumbnail image
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
    const ticket = this.props.tickets.selected;
    const isLoading = this.props.tickets.inProgress;

    return (
      <Container>
        <Helmet>
          <title>New Video</title>
        </Helmet>
        <PageHeader title="New Video" isLoading={isLoading} />
        <div className="section">
          {ticket.hasOwnProperty('id') &&
            <Card as={Link}
              to={this.state.urlToTicket}
              header="Attached Ticket"
              description={ticket.name}
              centered />
          }
        </div>
        <div className="mid-container">
          <Form onSubmit={this.handleSubmit} className="align-left">
            {this.state.videoDataList.map((videoData, i) => {
              return (
                <NewVideoForm key={i}
                  handleChange={this.handleTitleChange}
                  videoData={videoData}
                  handleSelect={this.handleSelect}
                  isLoading={isLoading}
                  titleError={this.state.titleError} />
              );
            })}
            <div className="float-left">
              <Button color="red" onClick={this.removeAllVideos()} disabled={isLoading}>
                Remove All
              </Button>
            </div>
            <div className="float-right margin-bot">
              <Button onClick={this.addVideo()} disabled={isLoading} color="blue">
                Add Video
              </Button>
              <Button color="blue" loading={this.props.tickets.inProgress}>Submit</Button>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}

NewVideoContainer.propTypes = propTypes;

const mapStateToProps = (state) => ({
  tickets: state.tickets
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getTicketByName, updateTicket, updateTicketWithVideos }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewVideoContainer));
