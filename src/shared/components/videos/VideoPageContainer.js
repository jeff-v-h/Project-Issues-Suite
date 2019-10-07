import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { object } from "prop-types";
import toastr from "toastr";
import { Container, Card, Button } from "semantic-ui-react";
import ReactPlayer from "react-player";
import { Helmet } from "react-helmet";

import { status } from "../../config/constants";
import {
  getTicketByName,
  updateTicket,
  selectVideo
} from "../../actions/tickets-actions";
import PageHeader from "../common/PageHeader";
import EditVideoForm from "./EditVideoForm";
import DeleteModal from "../common/DeleteModal";
import NoteInput from "./NoteInput";
import NoteList from "./NoteList";
import {
  nameCheck,
  getPath,
  encodeUrlComponent,
  decodeUrlComponent
} from "../../../helpers/utils";
import Page404 from "../globals/404/Page404";

const propTypes = {
  actions: object.isRequired,
  tickets: object.isRequired,
  history: object.isRequired
};

class VideoPageContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const path = getPath();
    const urlParts = path.split("/");
    const ticket = props.tickets.selected;
    // When url is accessed directly, ensure there is a selected ticket in the redux store
    if (!ticket.hasOwnProperty("id")) {
      const ticketName = decodeUrlComponent(urlParts[2]);
      props.actions.getTicketByName(urlParts[1], ticketName);
    }

    this.state = {
      video: Object.assign({}, props.tickets.video),
      showModal: false,
      detailsChanged: false,
      vidTitle: decodeUrlComponent(urlParts[3]),
      notes: props.tickets.video.notes || [],
      newNotes: [],
      removedNotes: [],
      titleError: false,
      noteInputError: false,
      pathToTicket: path.substr(0, path.lastIndexOf("/")),
      notFound: false
    };

    this.player = React.createRef();
    this.noteInput = React.createRef();
  }

  // When page is accessed directly (eg. page refreshed):
  // Once the video is selected below in componentDidUpdate, update state with the video
  // this.state used to render video properties (instead of directly from redux store)
  // to be able to change display of notes (and title) without directly mutating state
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.notes.length < 1 &&
      nextProps.tickets.video.hasOwnProperty("notes") &&
      prevState.removedNotes.length < 1
    ) {
      return {
        video: nextProps.tickets.video,
        notes: nextProps.tickets.video.notes
      };
    } else {
      return null;
    }
  }

  // When page is loaded directly and ticket request in constructor is completed,
  // reupdate the store with the selected video.
  componentDidUpdate(prevProps) {
    const { tickets, actions } = this.props;
    if (prevProps.tickets.selected != tickets.selected) {
      const video = tickets.selected.videos.find(
        v => v.title == this.state.vidTitle
      );
      if (typeof video == "undefined") {
        this.setNotFound();
      } else {
        actions.selectVideo(video);
      }
    }
  }

  setNotFound = () => this.setState({ notFound: true });

  handleSubmit = e => {
    e.preventDefault();
    const { actions } = this.props;
    const ticket = Object.assign({}, this.props.tickets.selected);
    const video = Object.assign({}, this.state.video);

    if (nameCheck.isAllowed(video.title)) {
      this.setState({ titleError: true });
      toastr.error(nameCheck.errorMsg);
      return;
    }

    // Check the video title does not exist for this ticket
    // Only need to check if the name has changed
    const titleChanged =
      video.title != ticket.videos.find(x => x.id == video.id).title;
    const titleExists = ticket.videos.some(
      v => v.title.toUpperCase() == video.title.toUpperCase()
    );
    if (titleChanged && titleExists) {
      this.setState({ titleError: true });
      toastr.error(
        `Title '${video.title}' already exists for ticket '${ticket.name}'`
      );
      return;
    }

    // Add the new Notes to notes (which already has removed notes)
    if (this.notesChanged()) {
      video.notes = this.state.notes.concat(this.state.newNotes);
      // Sort the notes in order by time
      video.notes = video.notes.sort(this.compare);
    }

    // Replace the video with the new data
    ticket.videos = ticket.videos.map(v => (v.id == video.id ? video : v));

    actions
      .updateTicket(ticket)
      .then(() => {
        // Url name needs to change to reflect new name
        if (this.titleChanged())
          this.props.history.push(
            this.state.pathToTicket + "/" + encodeUrlComponent(video.title)
          );

        actions.selectVideo(video);
        this.setState({
          video: video,
          notes: video.notes,
          newNotes: [],
          removedNotes: [],
          titleError: false,
          noteInputError: false
        });

        toastr.success("Video updated");
      })
      .catch(error => toastr.error(error));
  };

  // Compare function used in .sort() to help decide if note's time is smaller or larger
  compare = (note1, note2) => {
    if (note1.time < note2.time) return -1;
    if (note1.time > note2.time) return 1;
    return 0;
  };

  updateVideoState = e => {
    const field = e.target.name;
    const video = Object.assign({}, this.state.video);
    video[field] = e.target.value;
    return this.setState({ video });
  };

  addNote = () => {
    const newNote = {
      time: this.player.current.getCurrentTime(),
      text: this.noteInput.current.inputRef.value
    };

    if (nameCheck.isOnlyWhitespace(newNote.text)) {
      this.setState({ noteInputError: true });
      toastr.error("Notes must have a character");
      return;
    }

    const callbackFn = () => (this.noteInput.current.inputRef.value = "");

    this.setState(
      prevState => ({
        newNotes: [...prevState.newNotes, newNote].sort(this.compare),
        detailsChanged: true,
        noteInputError: false
      }),
      callbackFn
    );
  };

  removeNote = note => {
    return () => {
      this.setState(prevState => ({
        notes: prevState.notes.filter(n => n != note),
        removedNotes: [...prevState.removedNotes, note].sort(this.compare)
      }));
    };
  };

  reAddNote = note => {
    return () => {
      this.setState(prevState => ({
        notes: [...prevState.notes, note].sort(this.compare),
        removedNotes: prevState.removedNotes.filter(n => n != note)
      }));
    };
  };

  removeNewNote = note => {
    return () => {
      this.setState(prevState => ({
        newNotes: prevState.newNotes.filter(n => n != note)
      }));
    };
  };

  clearNoteChanges = () => {
    this.setState({
      notes: this.props.tickets.video.notes,
      newNotes: [],
      removedNotes: []
    });
  };

  notesChanged = () => {
    return this.state.newNotes.length > 0 || this.state.removedNotes.length > 0;
  };

  titleChanged = () => {
    return this.props.tickets.video.title != this.state.video.title;
  };

  detailsChanged = () => {
    return this.notesChanged() || this.titleChanged();
  };

  seekTo = time => {
    return () => {
      this.player.current.seekTo(time);
    };
  };

  // Convert the total seconds into the desired display format mm:ss.ms
  displayTime = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    let secondsRounded = Number("0" + (totalSeconds % 60))
      .toFixed(2)
      .slice(-5);
    if (secondsRounded.length < 5) {
      secondsRounded = "0" + secondsRounded;
    }

    return minutes + ":" + secondsRounded;
  };

  deleteVideo = () => {
    const { actions, history, tickets } = this.props;
    const ticket = tickets.selected;
    const updatedVideoList = ticket.videos.filter(
      v => v.id !== tickets.video.id
    );

    ticket.videos = updatedVideoList;

    actions
      .updateTicket(ticket)
      .then(() => {
        actions.selectVideo({});
        toastr.success(`Video deleted.`);
        history.push(this.state.pathToTicket);
      })
      .catch(error => {
        this.hideDeleteModal();
        toastr.error(error);
      });
  };

  showDeleteModal = () => this.setState({ showModal: true });

  hideDeleteModal = () => this.setState({ showModal: false });

  render() {
    const { tickets } = this.props;
    if (this.state.notFound) {
      return <Page404 />;
    }

    return (
      <Container>
        <Helmet>
          <title>Video</title>
        </Helmet>
        <PageHeader title="Video" isLoading={tickets.inProgress} />
        {tickets.selected.hasOwnProperty("id") && (
          <Card
            as={Link}
            to={this.state.pathToTicket}
            header="Attached Ticket"
            description={tickets.selected.name}
            centered
          />
        )}
        {this.state.video.hasOwnProperty("id") && (
          <div className="mid-container">
            <EditVideoForm
              video={tickets.video}
              handleSubmit={this.handleSubmit}
              updateVideoState={this.updateVideoState}
              ticketStatus={tickets.selected.status}
              titleError={this.state.titleError}
            />
            <ReactPlayer
              url={tickets.video.fileLocation}
              ref={this.player}
              controls
              width="640"
              height="400"
              className="auto-center"
            />
            <div className="section">
              <NoteList
                notes={this.state.notes}
                displayTime={this.displayTime}
                btnOnClick={this.removeNote}
                seekTo={this.seekTo}
              />
              <NoteList
                notes={this.state.newNotes}
                displayTime={this.displayTime}
                btnOnClick={this.removeNewNote}
                seekTo={this.seekTo}
                header="New"
              />
              <NoteList
                notes={this.state.removedNotes}
                displayTime={this.displayTime}
                btnOnClick={this.reAddNote}
                seekTo={this.seekTo}
                icon="plus"
                header="To Remove"
              />
              <NoteInput
                inputRef={this.noteInput}
                onClick={this.addNote}
                ticketStatus={tickets.selected.status}
                disabled={tickets.inProgress}
                noteInputError={this.state.noteInputError}
              />
            </div>
            {this.notesChanged() && (
              <div className="float-left">
                <Button
                  color="grey"
                  onClick={this.clearNoteChanges}
                  className="float-left"
                  disabled={tickets.inProgress}
                >
                  Clear Note Changes
                </Button>
              </div>
            )}
            <div className="align-right auto-center">
              <Button
                form="edit-form"
                loading={tickets.inProgress}
                disabled={!this.detailsChanged()}
                color="blue"
              >
                Save
              </Button>
              {tickets.selected.status == status.CLOSED ? (
                <Button negative disabled>
                  Delete
                </Button>
              ) : (
                <DeleteModal
                  show={this.state.showModal}
                  btnFunction={this.deleteVideo}
                  inProgress={tickets.inProgress}
                  showModal={this.showDeleteModal}
                  hideModal={this.hideDeleteModal}
                  message="Are you sure you want to delete this video?"
                />
              )}
            </div>
          </div>
        )}
      </Container>
    );
  }
}

VideoPageContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  tickets: state.tickets
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { getTicketByName, updateTicket, selectVideo },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoPageContainer)
);
