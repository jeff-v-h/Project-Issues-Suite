// This component handles the App template used on every page.
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf, object } from "prop-types";
import { bindActionCreators } from "redux";
import toastr from "toastr";
import { Confirm } from "semantic-ui-react";

import Routes from "./components/Routes";
import LoadingPage from "./LoadingPage";
import NavBar from "./components/globals/NavBar";
import UnsupportedBrowser from "./components/common/UnsupportedBrowser";
import { getUser, createUser, clearUser } from "./actions/user-actions";
import { getProjectsList } from "./actions/projects-actions";
import { routeCodes } from "./config/constants";
import * as auth from "../helpers/auth-utils";
import { getNameFromD3Email, isBrowserSupported } from "../helpers/utils";

const propTypes = {
  cookies: instanceOf(Cookies).isRequired,
  actions: object.isRequired,
  users: object.isRequired,
  projects: object.isRequired,
  history: object.isRequired
};

class App extends React.Component {
  constructor(props) {
    super(props);

    // set toastr position for the entire app
    toastr.options = { positionClass: "toast-top-center" };

    let isAuthed = false;
    // let isAuthed = true;
    let isLoading = false;
    let openPrefBox = false;

    // Check if the user is already logged in cookies or if being
    // redirected back from Microsoft login.
    // User data is only persisted cookies and redux state if they gave permission.
    // Set loading to true to show loader while obtaining user's theme preference
    if (this.isUserInCookies()) {
      // If user isnt already in redux state for some reason, get from DB
      if (!this.isUserInState()) {
        isLoading = true;
        const signinName = props.cookies.get("userSigninName");
        props.actions
          .getUser(signinName)
          .then(() => {
            this.setState({ isLoading: false });
          })
          .catch(err => {
            toastr.error(err);
            this.clearUserState();
            this.setState({ isLoading: false, isAuthed: false });
          });
      }
      isAuthed = true;
    } else if (window.location.hash) {
      isLoading = true;
      isAuthed = this.checkRedirectFromMicrosoft();
      // Check to see if user wants to stay logged in
      if (isAuthed) openPrefBox = true;
    } else {
      // Clear user data from redux state if user not found in cookies
      this.clearUserState();
    }

    // Always GET project list for up-to-date data
    if (isAuthed)
      props.actions
        .getProjectsList()
        .catch(() => toastr.error("Unable to update project list"));

    this.state = {
      isAuthed: isAuthed,
      redirectToReferrer: false,
      isLoading: isLoading,
      openPrefBox: openPrefBox
    };
  }

  componentWillUpdate() {
    if (toastr.options.timeOut == 0) {
      // reset toastr options after showing auth error
      toastr.options.timeOut = 5000;
      toastr.options.extendedTimeOut = 1000;
      toastr.options.positionClass = "toast-top-center";
    }
  }

  // Detect for change in props and change state if necessary
  componentDidUpdate(prevProps) {
    // Remove loading page if user request has been completed
    if (this.props.users.data !== prevProps.users.data) {
      // eslint-disable-next-line
      this.setState({ isLoading: false });
    }
  }

  isUserInCookies = () => {
    if (this.props.cookies.get("userSigninName")) return true;
    return false;
  };

  isUserInState = () => {
    return this.props.users.data.hasOwnProperty("id");
  };

  checkRedirectFromMicrosoft() {
    // If there is correct access token, access_token will be stored in sessionStorage.
    // If not, the window hash will change accordingly
    auth.handleTokenResponse(window.location.hash);

    // Authenticate or set an error depending on token response
    if (auth.isAccessToken()) {
      this.getOrCreateUserInDB();
      toastr.success("Login successful.");
      return true;
    } else {
      // If there is no access token, parse the error hash
      const errorResponse = auth.parseHashParams(window.location.hash);

      // Set action depending on type of error
      if (
        errorResponse.error === "login_required" ||
        errorResponse === "interaction_required"
      ) {
        // For these errors redirect the browser to the login page.
        window.location = auth.buildAuthUrl();
      } else {
        // Decode the response and then set error msg
        const errorName = auth.decodePlusEscaped(errorResponse.error);
        const errorDesc = auth.decodePlusEscaped(
          errorResponse.error_description
        );

        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.options.positionClass = "toast-top-full-width";
        toastr.error(errorDesc, errorName);
      }

      return false;
    }
  }

  // GET user from DB and set user in redux store, otherwise create user
  getOrCreateUserInDB = () => {
    const { actions, history } = this.props;
    const signinName = sessionStorage.userSigninName;

    // Attempt to get the user first
    actions.getUser(signinName).catch(error => {
      // Check for timeout request
      if (error.toString().includes("timeout")) {
        history.push(routeCodes.DASHBOARD);
        this.setState({ isAuthed: false, isLoading: false });
        toastr.info("Refresh page Login again to retry");
        toastr.error("Timeout: Unable to connect to database");
      } else if (
        typeof error.response != "undefined" &&
        error.response.status === 404
      ) {
        // If it is a NotFound 404 error, create user in DB instead
        const displayName = sessionStorage.userDisplayName;
        actions
          .createUser(signinName, displayName)
          .then(() => this.setState({ isAuthed: true, isLoading: false }));
      } else {
        // otherwise notify of error
        this.setState({ isAuthed: false, isLoading: false });
        toastr.error("Error occurred while getting additional user info.");
      }
    });
  };

  handleConfirm = () => {
    this.setUserInCookies();
    this.closePrefBox();
  };

  closePrefBox = () => this.setState({ openPrefBox: false });

  setUserInCookies = () => {
    const { cookies } = this.props;
    cookies.set("userSigninName", sessionStorage.userSigninName, { path: "/" });
    const displayName = getNameFromD3Email(sessionStorage.userSigninName);
    cookies.set("userDisplayName", displayName, { path: "/" });
  };

  signOut = () => {
    return e => {
      e.preventDefault();
      this.clearUserState();
      this.setState({ isAuthed: false });
      toastr.success("Logout successful.");
    };
  };

  clearUserState = () => {
    this.props.actions.clearUser();
    this.clearUserFromCookies();
    auth.clearUserSessionState();
  };

  clearUserFromCookies = () => {
    const { cookies } = this.props;
    cookies.remove("userDisplayName", { path: "/" });
    cookies.remove("userSigninName", { path: "/" });
  };

  authenticate = () => this.setState({ isAuthed: true });

  render() {
    if (this.state.isLoading) return <LoadingPage />;

    return (
      <div id="app" className={this.props.users.data.theme}>
        <div className="content-wrapper">
          <NavBar isAuthed={this.state.isAuthed} signOut={this.signOut} />
          <Confirm
            open={this.state.openPrefBox}
            content="Stay signed in on this browser indefinitely?"
            cancelButton="No"
            confirmButton="Yes"
            onCancel={this.closePrefBox}
            onConfirm={this.handleConfirm}
          />
          {!isBrowserSupported() && <UnsupportedBrowser />}
          <Routes
            isAuthed={this.state.isAuthed}
            authenticate={this.authenticate}
          />
        </div>
      </div>
    );
  }
}

App.propTypes = propTypes;

const mapStateToProps = state => ({
  users: state.users,
  projects: state.projects
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { getUser, createUser, clearUser, getProjectsList },
    dispatch
  )
});

export default withCookies(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
);
