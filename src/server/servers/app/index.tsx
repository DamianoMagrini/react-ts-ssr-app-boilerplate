import React from 'react';

import fs from 'fs';
import path from 'path';

import restify from 'restify';
import mime from 'mime-types';
import { renderToNodeStream } from 'react-dom/server';
// import ServerCache from './lib/server_cache';

import { ServerStyleSheet } from 'styled-components';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';

import { Transform } from 'stream';

import App from '../../../client/app/App';

export default (
  PUBLIC_PATH: string,
  CERTIFICATE_PATH: string,
  raw_html: string
) => {
  /*
    Split the app shell into two fragments:
    1. from `<!DOCTYPE html>` to `<div id="root">`
    2. from `</div>` to `</html>`
    To later render the app within the two.
  */
  const app_shell_fragments = raw_html.split('<!-- ::APP:: -->');

  // Create the server.
  const app_server = restify.createServer({
    http2: {
      key: fs.readFileSync(path.resolve(CERTIFICATE_PATH, 'private.key')),
      cert: fs.readFileSync(path.resolve(CERTIFICATE_PATH, 'certificate.crt'))
    }
  });

  // Use the default compression (requested by UA).
  app_server.use(restify.plugins.gzipResponse());

  // // Create a cache object.
  // const cache = new ServerCache();

  // app_server.use((request, response, next) => {
  //   if (request.url && cache.has(request.url)) {
  //     // Return the cached HTML for this path if it exists.
  //     return cache.get(request.url).then((content) => response.send(content));
  //   } else {
  //     // Otherwise go ahead and render it.
  //     next();
  //   }
  // });

  // const create_cache_stream = (key) => {
  //   const bufferedChunks = [];
  //   return new Transform({
  //     // transform() is called with each chunk of data
  //     transform(data, enc, cb) {
  //       // We store the chunk of data (which is a Buffer) in memory
  //       bufferedChunks.push(data);
  //       // Then pass the data unchanged onwards to the next stream
  //       cb(null, data);
  //     },

  //     // flush() is called when everything is done
  //     flush(cb) {
  //       // We concatenate all the buffered chunks of HTML to get the full HTML
  //       // then cache it at "key"
  //       cache.set(key, Buffer.concat(bufferedChunks));
  //       cb();
  //     }
  //   });
  // };

  app_server.get('**', (request, response) => {
    const split_path = (request.url || '').split('/');

    const resource_path = path.resolve(PUBLIC_PATH, ...split_path);

    if (
      /*
        The requested resource is within the `client` directory (no one is
        trying to hack anyone and everyone lives happy 😀).
      */
      resource_path.indexOf(path.resolve(PUBLIC_PATH)) === 0 &&
      // The requested resource exists and is a file.
      fs.existsSync(resource_path) &&
      fs.statSync(resource_path).isFile()
    ) {
      // Set the correct content/MIME type and send the file.
      response.header(
        'Content-Type',
        mime.contentType(path.extname(resource_path)) ||
          'application/octet-stream; charset=UTF-8'
      );
      response.end(fs.readFileSync(resource_path));
    } else {
      // Set the appropriate content type.
      response.header('Content-Type', 'text/html; charset=UTF-8');

      // Send the first fragment of the app shell.
      response.write(app_shell_fragments[0]);

      /*
        Create the `context` object, which will be passed into `StaticRouter`
        and used to detect errors or redirects.
      */
      let context: StaticRouterContext = {};

      // Render the app to a stream and collect styled-component's styles.
      const sheet = new ServerStyleSheet();

      const render_stream = sheet.interleaveWithNodeStream(
        renderToNodeStream(
          sheet.collectStyles(
            <StaticRouter location={request.url} context={context}>
              <App />
            </StaticRouter>
          )
        )
      );

      render_stream.pipe(
        response,
        { end: false }
      );

      // // Just some debug code.
      // render_stream.pipe(
      //   new Transform({
      //     transform(chunk, encoding, callback) {
      //       console.log(`Chunk received with encoding ${encoding}`);
      //       console.log(chunk.toString());
      //       callback(null, chunk);
      //     }
      //   })
      // );

      // When the app body has been sent, send the second fragment.
      render_stream.on('end', () => {
        response.end(app_shell_fragments[1]);
      });
    }
  });

  return app_server;
};
