import React from 'react';
import { bool } from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import { publicPath, routeCodes } from '../config/constants';
import { buildAuthUrl } from '../../helpers/auth-utils';
import PrivateRoute from './PrivateRoute';
import DashboardContainer from './dashboard/DashboardContainer';
import TicketPageContainer from './tickets/TicketPageContainer';
import BrowseContainer from './browse/BrowseContainer';
import ContactPage from './globals/contact/ContactPage';
import ManageProjectsContainer from './projects/ManageProjectsContainer';
import NewProjectContainer from './projects/NewProjectContainer';
import EditProjectContainer from './projects/EditProjectContainer';
import NewTicketContainer from './tickets/NewTicketContainer';
import NewVideoContainer from './videos/NewVideoContainer';
import VideoPageContainer from './videos/VideoPageContainer';
import Page404 from './globals/404/Page404';

const propTypes = {
  isAuthed: bool.isRequired
};

class Routes extends React.Component {
  renderLogin = () => {
    if (this.props.isAuthed) {
      return <Redirect to={routeCodes.DASHBOARD} />;
    } else {
      window.location = buildAuthUrl();
      return null;
    }
  }

  render() {
    const isAuthed = this.props.isAuthed;
    return  (
      <Switch>
        <PrivateRoute exact path={[publicPath, routeCodes.DASHBOARD]}
          isAuthed={isAuthed}
          component={DashboardContainer} />
        <PrivateRoute path={routeCodes.BROWSE}
          isAuthed={isAuthed}
          component={BrowseContainer} />
        <PrivateRoute path={routeCodes.MANAGE_PROJECTS}
          isAuthed={isAuthed}
          component={ManageProjectsContainer} />
        <PrivateRoute path={routeCodes.NEW_PROJECT}
          isAuthed={isAuthed}
          component={NewProjectContainer} />
        <PrivateRoute path={'/:projectName' + routeCodes.EDIT}
          isAuthed={isAuthed}
          component={EditProjectContainer} />
        <PrivateRoute path={'/:projectName' + routeCodes.NEW_TICKET}
          isAuthed={isAuthed}
          component={NewTicketContainer} />
        <PrivateRoute path={'/:projectName' + '/:ticketName' +  routeCodes.NEW_VIDEO}
          isAuthed={isAuthed}
          component={NewVideoContainer} />
        <PrivateRoute path={'/:projectName' + '/:ticketName' + '/:videoName'}
          isAuthed={isAuthed}
          component={VideoPageContainer} />
        <PrivateRoute exact path={'/:projectName' + '/:ticketName'}
          isAuthed={isAuthed}
          component={TicketPageContainer} />
        <Route path={routeCodes.LOGIN} render={this.renderLogin} />
        <Route path={routeCodes.CONTACT} component={ContactPage} />
        <Route component={Page404} />
      </Switch>
    );
  }
}

Routes.propTypes = propTypes;

export default Routes;
