import React from "react";
import { func, string } from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";

import { routeCodes, roles } from "../../config/constants";

UserMenu.propTypes = {
  signOut: func.isRequired,
  displayName: string,
  changeTheme: func.isRequired,
  role: string
};

UserMenu.defaultProps = {
  displayName: "User"
};

function UserMenu({ signOut, displayName, changeTheme, role }) {
  return (
    <Dropdown
      item
      simple
      direction="left"
      className="nav-dd nav-item"
      text={displayName}
    >
      <Dropdown.Menu>
        {/* <div>
          <Dropdown.Item onClick={changeTheme} text="Change Theme"/>
        </div> */}
        {/* {role == roles.ADMIN && ( */}
        <div>
          <Dropdown.Item
            as={Link}
            to={routeCodes.MANAGE_PROJECTS}
            text="Manage Projects"
          />
        </div>
        {/* )} */}
        <div>
          <Dropdown.Item onClick={signOut()} text="Logout" />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UserMenu;
