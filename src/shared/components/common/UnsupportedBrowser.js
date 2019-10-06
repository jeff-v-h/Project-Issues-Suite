import React from 'react';
import { Container, Message } from 'semantic-ui-react';

function UnsupportedBrowser() {
  return (
    <Container>
      <Message negative>
        <Message.Header>Unsupported Browser</Message.Header>
        <p>Login via Microsoft requires browser support for
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API">
            session storage
          </a>
          and
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/RandomSource/getRandomValues">
            <code>crypto.getRandomValues</code>
          </a>.
        </p>
        <p>Unfortunately, your browser does not support one or both features.
          Please visit this page using a different or upgraded browser.</p>
      </Message>
    </Container>
  );
}

export default UnsupportedBrowser;
