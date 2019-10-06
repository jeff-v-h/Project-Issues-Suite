import React from 'react';
import { func, bool } from 'prop-types';
import { Button } from 'semantic-ui-react';

FavButton.propTypes = {
  isFavourited: bool,
  favFunction: func.isRequired,
  unFavFunction: func.isRequired,
  disabled: bool
};

FavButton.defaultProps = {
  isFavourited: false,
  disabled: false
};

function FavButton({ isFavourited, favFunction, unFavFunction, disabled }) {
  return isFavourited
  ? <Button icon="favorite" color="yellow" onClick={unFavFunction} circular disabled={disabled} />
  : <Button icon="favorite" color="grey" onClick={favFunction} circular disabled={disabled} />;
}

export default FavButton;
