import path from 'path';

import { Configuration } from 'webpack';

type ServiceWorkerMode = 'development' | 'production';

export default (
  PACKAGE_ROOT: string,
  mode: ServiceWorkerMode
): Configuration => ({
  name: `${mode}:service-worker`,
  mode: mode,

  target: 'web',

  entry: [path.resolve(PACKAGE_ROOT, 'src', 'service-worker', 'index.ts')],

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
          )
        }
      }
    ]
  },

  devtool: mode === 'development' ? 'inline-source-map' : undefined,

  resolve: {
    extensions: ['.js', '.ts']
  },

  output: {
    filename: 'service-worker.js',
    path: path.resolve(PACKAGE_ROOT, 'dist', 'public')
  }
});
