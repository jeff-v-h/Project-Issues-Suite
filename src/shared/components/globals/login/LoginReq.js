import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

import PageHeader from '../../common/PageHeader';

function LoginReq() {
  return (
    <Container>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <PageHeader title="Login Required" />
      <p>Please sign in with your Outlook account to access content.</p>
      <Button as={Link} to={"/login"} primary>Login via Microsoft</Button>
    </Container>
  );
}

export default LoginReq;
