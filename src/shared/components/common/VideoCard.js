import React from 'react';
import { object, func } from 'prop-types';
import { Card, Image } from 'semantic-ui-react';

VideoCard.propTypes = {
  clickFunction: func.isRequired,
  video: object
};

VideoCard.defaultProps = {
  video: { title: "" }
};

function VideoCard({ clickFunction, video }) {
  return (
    <Card onClick={clickFunction} raised>
      <Image src={video.thumbnail} />
      <Card.Content>
        <Card.Header>{video.title}</Card.Header>
      </Card.Content>
    </Card>
  );
}

export default VideoCard;
