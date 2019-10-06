import React from 'react';
import { Link } from 'react-router-dom';
import { routeCodes } from '../../../config/constants';

import PageHeader from '../../common/PageHeader';

function Page404() {
  return (
    <div>
      <PageHeader title="Not Found" />
      <div>
        <p>No match was found for <code>{location.host + location.pathname}</code></p>
        <p>Please check spelling or click here to go to the main page:
          <Link to={routeCodes.HOME}>{location.host}</Link></p>
      </div>
    </div>
  );
}

export default Page404;
