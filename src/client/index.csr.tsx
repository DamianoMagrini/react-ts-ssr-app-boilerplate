import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import App from './app/App';

import register_service_worker from './register_service_worker';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

register_service_worker();
