import React, { Component } from 'react';

import Helmet from 'react-helmet';

class NotFound extends Component {
  render() {
    return (
      <>
        <Helmet
          title={'404 - not found!'}
          meta={[{ name: 'ROBOTS', content: 'NOINDEX' }]}
        />
        <h2>404 - not found!</h2>
      </>
    );
  }
}

export default NotFound;
