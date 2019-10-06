import React from 'react';
import { func, bool } from 'prop-types';

import LoginReq from './globals/login/LoginReq';

PrivateRoute.propTypes = {
  component: func.isRequired,
  isAuthed: bool.isRequired
};

function PrivateRoute({ component: Component, isAuthed, ...props }) {
  return isAuthed ? <Component {...props} /> : <LoginReq />;
}

export default PrivateRoute;
