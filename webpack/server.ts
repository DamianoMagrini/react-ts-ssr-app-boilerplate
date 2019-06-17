import path from 'path';

import { Configuration } from 'webpack';

import DisableOutputPlugin from './lib/disable_output_plugin';
import EmitAllPlugin from './lib/emit_all_plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

type ClientMode = 'development' | 'production';

export default (PACKAGE_ROOT: string, mode: ClientMode): Configuration => ({
  name: `${mode}:server`,
  mode: mode,

  target: 'node',

  entry: path.resolve(PACKAGE_ROOT, 'src', 'server', 'index.ts'),

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(
            PACKAGE_ROOT,
            'src',
            'server',
            'tsconfig.json'
          )
        }
      }
    ]
  },

  plugins: [
    // Disable the output of a single bundle.
    new DisableOutputPlugin(),
    // Instead, output separate transpiled files.
    new EmitAllPlugin({
      path: path.resolve(PACKAGE_ROOT, 'dist'),
      path_replacements: [
        {
          from: /\.tsx?/,
          to: '.js'
        },
        { from: /src/, to: '.' }
      ]
    }),
    // And copy the appropriate SSL certificate.
    new CopyWebpackPlugin([
      {
        from: path.resolve(PACKAGE_ROOT, 'ssl', mode),
        to: path.resolve(PACKAGE_ROOT, 'dist', 'server', 'ssl')
      }
    ])
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
});
