import React, { Component } from 'react';

import Helmet from 'react-helmet';

import { Button } from '../components';

class Home extends Component {
  render() {
    return (
      <>
        <Helmet title={'Home, sweet home'} />
        <p>Welcome home!</p>
        <Button
          onClick={() => {
            console.log('Hello 1!');
          }}>
          Hello 1!
        </Button>
        <Button
          onClick={() => {
            console.log('Hello 2!');
          }}>
          Hello 2!
        </Button>
      </>
    );
  }
}

export default Home;
