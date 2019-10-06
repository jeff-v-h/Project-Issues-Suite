import React from 'react';
import { array, string, func, bool } from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Card } from 'semantic-ui-react';

import VideoCard from './VideoCard';

VideoSection.propTypes = {
  videos: array,
  pathToNewVideo: string.isRequired,
  redirectToVideo: func.isRequired,
  status: string,
  disabled: bool
};

VideoSection.defaultProps = {
  videos: [],
  status: 'closed',
  disabled: false
};

function VideoSection({ videos, pathToNewVideo, redirectToVideo, status, disabled }) {
  return (
    <div className="auto-center">
      <h2>Videos</h2>
      <div className="align-right auto-center">
        {status != 'closed' ?
          <Button as={Link} to={pathToNewVideo} primary disabled={disabled}>
            Add Video
          </Button>
        : <Button primary disabled>Ticket Closed</Button>
        }
      </div>
      <div className="mid-container">
        {videos.length > 0 ? (
          <Card.Group itemsPerRow={2} className="align-left" stackable centered>
            {videos.map((vid, i) => (
              <VideoCard key={i}
                clickFunction={redirectToVideo(vid)}
                video={vid} />
            ))}
          </Card.Group>
        ) : (
          <div>Ticket has no videos</div>
        )}
      </div>
    </div>
  );
}

export default VideoSection;
