import path from 'path';
import { Compiler } from 'webpack';

interface PluginOptions {
  path?: string;
  path_replacements?: { from: string | RegExp; to: string }[];
  ignore_pattern?: RegExp;
  ignore_externals?: boolean;
}

interface InternalPluginOptions {
  path?: string;
  path_replacements: { from: string | RegExp; to: string }[];
  ignore_pattern: RegExp;
  ignore_externals: boolean;
}

export default class EmitAllPlugin {
  options: InternalPluginOptions;

  constructor(options: PluginOptions = {}) {
    this.options = {
      path: options.path,
      path_replacements: options.path_replacements || [],
      ignore_pattern: options.ignore_pattern || /node_modules/,
      ignore_externals: Boolean(options.ignore_externals)
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterCompile.tapAsync(
      'EmitAllPlugin',
      (compilation, callback) => {
        const { modules } = compilation;

        modules.forEach((mod) => {
          const absolute_path = (mod.options || mod).resource;

          if (
            (this.options.ignore_externals && mod.external) ||
            this.options.ignore_pattern.test(absolute_path)
          )
            return;

          // Used for the vendor chunk.
          if (mod.constructor.name === 'MultiModule') return;

          if (!mod._source) return;

          const source = mod._source._value;
          const projectRoot = compiler.context;
          // @ts-ignore
          const out: string = this.options.path || compiler.options.output.path;

          let dest = path.join(out, absolute_path.replace(projectRoot, ''));

          this.options.path_replacements.forEach(
            ({ from, to }) => (dest = dest.replace(from, to))
          );

          compiler.outputFileSystem.mkdirp(path.dirname(dest), (err) => {
            if (err) throw err;

            compiler.outputFileSystem.writeFile(dest, source, (err) => {
              if (err) throw err;
            });
          });
        });
        callback();
      }
    );
  }
}
