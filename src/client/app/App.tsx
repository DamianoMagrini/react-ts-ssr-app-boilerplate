import React, { Component } from 'react';

import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import * as routes from './routes';

class App extends Component {
  render() {
    return (
      <div>
        <Helmet defaultTitle={'React + TS SSR App Boilerplate'} />
        <Switch>
          <Route exact path={'/'} component={routes.Home} />
          <Route component={routes.NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
