import fs from 'fs';
import path from 'path';

import { Configuration } from 'webpack';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';

import createStyledComponentsTransformer from 'typescript-plugin-styled-components';

type ClientMode = 'hot' | 'development' | 'production';

export default (PACKAGE_ROOT: string, mode: ClientMode): Configuration => ({
  name: `${mode}:client`,
  mode: mode === 'production' ? 'production' : 'development',

  devtool: mode === 'production' ? undefined : 'inline-source-map',
  target: 'web',

  entry:
    /*
      In hot mode, use `index.hot.tsx` instead of `index.tsx`. The difference
      is that `index.hot.tsx`:
      - calls `render` instead of `hydrate`
      - doesn't register the service worker
    */
    mode === 'hot'
      ? {
          main: [path.resolve(PACKAGE_ROOT, 'src', 'client', `index.hot.tsx`)]
        }
      : {
          csr: [path.resolve(PACKAGE_ROOT, 'src', 'client', `index.csr.tsx`)],
          ssr: [path.resolve(PACKAGE_ROOT, 'src', 'client', `index.ssr.tsx`)]
        },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(
            PACKAGE_ROOT,
            'src',
            'client',
            'tsconfig.json'
          ),
          getCustomTransformers: () =>
            mode === 'production'
              ? undefined
              : {
                  before: [createStyledComponentsTransformer()]
                }
        }
      }
    ]
  },

  plugins: [
    // File used for server-side rendering; calls `ReactDOM.hydrate`.
    new HtmlWebPackPlugin({
      template: path.resolve(PACKAGE_ROOT, 'src', 'client', 'index.ssr.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: mode === 'production'
      },
      excludeChunks: ['csr']
    }),
    // File used for client-side rendering; calls `ReactDOM.render`.
    new HtmlWebPackPlugin({
      template: path.resolve(PACKAGE_ROOT, 'src', 'client', 'index.csr.html'),
      filename: 'index.csr.html',
      minify: {
        collapseWhitespace: mode === 'production'
      },
      excludeChunks: ['ssr']
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(PACKAGE_ROOT, 'src', 'client', 'resources') }
    ])
  ],

  output: {
    filename: '[name].bundle.js',
    // chunkFilename: '[contenthash].bundle.js',
    path:
      mode !== 'hot' ? path.resolve(PACKAGE_ROOT, 'dist', 'public') : undefined,
    publicPath: '/'
  },

  devServer:
    mode === 'hot'
      ? {
          contentBase: path.resolve(PACKAGE_ROOT, 'src', 'client', 'resources'),
          historyApiFallback: true,
          compress: true,
          https: {
            key: fs.readFileSync(
              path.resolve(PACKAGE_ROOT, 'ssl', 'development', 'private.key')
            ),
            cert: fs.readFileSync(
              path.resolve(
                PACKAGE_ROOT,
                'ssl',
                'development',
                'certificate.crt'
              )
            )
          }
        }
      : undefined,

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }

  /*
    Code splitting is currently disabled, as it doesn't provide a notable
    performance improvement. It will be enabled as soon as `React.Suspense` is
    supported on the server side. Nonetheless, you can uncomment this lines
    and line 85 to enable it, but you might have to tweak the service worker if
    you do.
  */
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // }
});
