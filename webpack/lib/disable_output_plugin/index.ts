import { Compiler } from 'webpack';

class DisableOutputWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      'DisableOutputWebpackPlugin',
      (compilation, callback) => {
        Object.keys(compilation.assets).forEach((asset) => {
          delete compilation.assets[asset];
        });
        callback();
      }
    );
  }
}

export default DisableOutputWebpackPlugin;
