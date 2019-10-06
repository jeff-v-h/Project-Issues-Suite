import React from 'react';
import { string, bool } from 'prop-types';
import { Container, Header, Divider, Loader } from 'semantic-ui-react';

PageHeader.propTypes = {
  title: string.isRequired,
  isLoading: bool
};

PageHeader.defaultProps = {
  isLoading: false
};

function PageHeader({title, isLoading}) {
  return (
    <Container className="app-header">
      <Header as="h1">{title}</Header>
      <Divider />
      {isLoading && <Loader active inline size="medium"/>}
    </Container>
  );
}

export default PageHeader;
