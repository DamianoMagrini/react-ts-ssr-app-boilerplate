import { resolve } from 'path';

const PACKAGE_ROOT = resolve(__dirname);

import client from './webpack/client';
import server from './webpack/server';
import service_worker from './webpack/service_worker';

export default [
  service_worker(PACKAGE_ROOT, 'development'), // development:service-worker
  service_worker(PACKAGE_ROOT, 'production'), // production:service-worker

  client(PACKAGE_ROOT, 'hot'), // hot:client
  client(PACKAGE_ROOT, 'development'), // development:client
  client(PACKAGE_ROOT, 'production'), // production:client

  server(PACKAGE_ROOT, 'development'), // development:server
  server(PACKAGE_ROOT, 'production') // production:server
];
