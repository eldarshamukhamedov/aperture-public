import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { devOrOptimized, resolveLocalDependency } from '../utils.js';

// Inline CSS in <style> tags in development mode
export const inlineStylesLoader = () =>
  devOrOptimized({ loader: 'style-loader' }, null);

// Extract styles to separate file in optimized mode
export const extractStylesToFileLoader = () =>
  devOrOptimized(null, { loader: MiniCssExtractPlugin.loader });

// Resolve CSS imports in JS modules
export const cssLoader = ({ importLoaders = 0 }) => ({
  loader: 'css-loader',
  options: {
    // `importLoaders` is a confusing API option that acts as a "load order" of
    // sorts. It tells `css-loader` how many other style loaders run before it
    // Examples:
    //    Plain CSS:         0 => css-loader (default)
    //    Polyfilled CSS:    1 => postcss-loader => css-loader
    //    Polyfilled SASS:   2 => postcss-loader, sass-loader => css-loader
    // See Webpack docs: https://webpack.js.org/loaders/css-loader/#importloaders
    importLoaders,
    sourceMap: true,
  },
});

// Polyfill CSS based on the browserlist config
export const postCssLoader = () => ({
  loader: resolveLocalDependency('postcss-loader'),
  options: {
    postcssOptions: {
      ident: 'postcss',
      plugins: [postcssFlexbugsFixes, postcssPresetEnv({ stage: 2 })],
      sourceMap: true,
    },
  },
});

// Resolve and compile SASS imports
export const sassLoader = () => ({
  loader: 'sass-loader',
  options: { sourceMap: true },
});

// Resolve and compile JS and TS imports
export const babelLoader = () => ({
  loader: 'babel-loader',
  options: {
    // Cache compile results in ./node_modules/.cache/babel-loader/
    cacheDirectory: true,
    cacheCompression: devOrOptimized(false, true),
    compact: devOrOptimized(false, true),
  },
});
