import React from "react";
import { Loader, Image } from "semantic-ui-react";

import logo from "../../public/images/project-design-amped-name.png";

function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <Image src={logo} size="medium" alt="logo" className="loading-logo" />
        <Loader active size="big" />
      </div>
    </div>
  );
}

export default LoadingPage;
