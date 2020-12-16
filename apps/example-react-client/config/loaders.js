import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { devOrOptimized } from './utils';

// Resolve static file imports (catch-all)
export const fileLoader = () => ({
  loader: 'file-loader',
  options: { name: 'static/media/[name].[hash:8].[ext]' },
});

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
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: [postcssFlexbugsFixes, postcssPresetEnv({ stage: 2 })],
    sourceMap: true,
  },
});

// Resolve and compile SASS imports
export const sassLoader = () => ({
  loader: 'sass-loader',
  options: { sourceMap: true },
});

// Resolve image imports and inline smaller images
export const imageLoader = () => ({
  loader: 'url-loader',
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
    // For very small images, such as logos or icons, the overhead of fetching
    // these images over the network can add up quickly. It is better to transform
    // them to base64 URIs and inline them.
    limit: 8192,
  },
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
