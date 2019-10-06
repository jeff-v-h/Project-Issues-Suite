import React from 'react';
import { Link } from 'react-router-dom';
import { bool, func, instanceOf, object } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Icon, Responsive, Image } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import toastr from 'toastr';

import UserMenu from '../user/UserMenu';
import { updateUser } from '../../actions/user-actions';
import { routeCodes } from '../../config/constants';
import d3Logo from '../../../../public/images/Deltatre_logo_RGB_red_150x30.png';

const propTypes = {
  isAuthed: bool.isRequired,
  signOut: func.isRequired,
  cookies: instanceOf(Cookies).isRequired,
  actions: object.isRequired,
  users: object.isRequired
};

class NavBar extends React.Component {
  state = {
    show: false,
    showNav: false
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    if (window.innerWidth > 767) {
      this.setState({showNav: true});
    } else {
      this.setState({showNav: false});
    }
  }

  changeShowState = () => {
    this.setState(prevState => ({
      show: !prevState.show
    }));
  }

  changeTheme = () => {
    const app = document.getElementById('app');
    let theme;
    const light = 'theme-light';
    const dark = 'theme-dark';
    const { actions, users } = this.props;

    if (app.classList.contains(light)) {
      // even though theme is accessed directly from redux store,
      // immediately changing class here reduces delay and improves UX
      app.classList.add(dark);
      app.classList.remove(light);
      theme = dark;
    } else {
      app.classList.add(light);
      app.classList.remove(dark);
      theme = light;
    }

    // change the redux stored user's theme to the selected theme and update the db
    users.data.theme = theme;
    actions.updateUser(users.data.signinName, users.data)
      .catch(err => toastr.error('An error occurred trying to update user theme preference'));
  }

  showHideNav = () => {
    this.setState(prevState => ({
      showNav: !prevState.showNav
    }));
  }

  render() {
    return (
      <Menu stackable className="nav-menu-wrapper">
        <Responsive {...Responsive.onlyMobile} className="nav-menu">
          <Image src={d3Logo} size="small" alt="monograme" floated="left"
            className="hamburger-menu logo" as={Link} to={routeCodes.DASHBOARD}/>
          <Icon name="sidebar" size="large" onClick={this.showHideNav}
            className="float-right hamburger-menu"/>
        </Responsive>
        {this.state.showNav &&
          <Menu stackable borderless fluid className="nav-menu">
            <Responsive minWidth={768}>
              <Menu.Item>
                <Image src={d3Logo} size="small" alt="logo" as={Link} to={routeCodes.DASHBOARD}/>
              </Menu.Item>
            </Responsive>
            <Menu.Item name="Dashboard" as={Link} to={routeCodes.DASHBOARD} className="nav-item"/>
            <Menu.Item name="Browse" as={Link} to={routeCodes.BROWSE} className="nav-item"/>
            <Menu.Menu position="right">
              <Menu.Item name="Contact" as={Link} to={routeCodes.CONTACT} className="nav-item"/>
              {this.props.isAuthed ? (
                <UserMenu signOut={this.props.signOut}
                  displayName={this.props.users.data.displayName}
                  changeTheme={this.changeTheme}
                  role={this.props.users.data.role} />
              ) : (
                <Menu.Item name="Login" as={Link} to={routeCodes.LOGIN} />
              )}
            </Menu.Menu>
          </Menu>
        }
      </Menu>
    );
  }
}

NavBar.propTypes = propTypes;

const mapStateToProps = (state) => ({
  users: state.users
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ updateUser }, dispatch)
});

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(NavBar));
