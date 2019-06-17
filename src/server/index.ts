import fs from 'fs';
import path from 'path';

// This will point to `dist/.../public`, as the server script is located in `dist/.../server`.
const PUBLIC_PATH = path.resolve(__dirname, '..', 'public');
// This will point to `.../ssl`.
const CERTIFICATE_PATH = path.resolve(__dirname, '.', 'ssl');

const raw_html = fs.readFileSync(
  path.resolve(PUBLIC_PATH, 'index.html'),
  'utf-8'
);

import generate_app_server from './servers/app';
generate_app_server(PUBLIC_PATH, CERTIFICATE_PATH, raw_html).listen(443, () =>
  console.log('HTTPS server up and running on port 443!')
);

import redirect_server from './servers/redirect';
redirect_server.listen(80, () =>
  console.log('Redirect server up and running on port 80!')
);
