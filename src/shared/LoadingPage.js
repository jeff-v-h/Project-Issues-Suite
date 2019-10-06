import React from 'react';
import { Loader, Image } from 'semantic-ui-react';

import d3Monogram from '../../public/images/DELTATRE_MONOGRAM_rgb_red_300x208.png';

function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <Image src={d3Monogram} size="medium" alt="logo" className="loading-logo" />
        <Loader active size="big" />
      </div>
    </div>
  );
}

export default LoadingPage;
