import { mapValues, merge, pick } from 'lodash';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import EsLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import TerserPlugin from 'terser-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import webpack from 'webpack';

import { devOrOptimized, loadEnv } from './utils';

// Minimize and mangle JS
export const minimizeJsPlugin = (overrideConfig = {}) => {
  const defaultConfig = {
    terserOptions: {
      parse: { ecma: 8 },
      compress: { ecma: 8, inline: 2 },
      mangle: { safari10: false },
      output: { ecma: 8, ascii_only: true, safari10: false },
    },
    parallel: true,
    cache: true,
    sourceMap: true,
  };
  return new TerserPlugin(merge(defaultConfig, overrideConfig));
};

// Minimize CSS
export const minimizeCssPlugin = () =>
  new OptimizeCssAssetsPlugin({
    cssProcessorOptions: {
      parser: safePostCssParser,
      map: { inline: false, annotation: true },
    },
  });

// Run ESLint checks
export const eslintPlugin = (overrideConfig = {}) => {
  const defaultConfig = {
    emitWarning: devOrOptimized(true, false),
    extensions: ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx'],
  };
  return new EsLintPlugin(merge(defaultConfig, overrideConfig));
};

// Detect circular dependencies
export const circularDependencyPlugin = (overrideConfig = {}) => {
  const { PACKAGE_ROOT } = loadEnv();
  const defaultConfig = {
    allowAsyncCycles: true,
    cwd: PACKAGE_ROOT,
    exclude: /node_modules/,
    failOnError: devOrOptimized(false, true),
  };
  return new CircularDependencyPlugin(merge(defaultConfig, overrideConfig));
};

// Create the index.html file that is used to serve the app
export const htmlWebpackPlugin = (overrideConfig = {}) => {
  const { PUBLIC_DIR } = loadEnv();
  const defaultConfig = {
    inject: true,
    template: `${PUBLIC_DIR}/index.html`,
    minify: devOrOptimized(false, {
      collapseWhitespace: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    }),
  };
  return new HtmlWebpackPlugin(merge(defaultConfig, overrideConfig));
};

// Interpolate strings, such as env variables, in the index.html template
export const interpolateHtmlPlugin = (values = {}) => {
  const { PUBLIC_PATH } = loadEnv();
  return new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
    PUBLIC_PATH,
    ...values,
  });
};

// Copy favicon to the build folder
export const copyFaviconPlugin = () => {
  const { BUILD_DIR, PUBLIC_DIR } = loadEnv();
  return devOrOptimized(
    null,
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PUBLIC_DIR}/favicon.ico`, to: `${BUILD_DIR}/favicon.ico` },
      ],
    }),
  );
};

// Inject environment variables into the bundle
export const injectEnvVarsPlugin = (allowedKeys = undefined) => {
  const env = loadEnv();
  const filteredEnv = Array.isArray(allowedKeys) ? pick(env, allowedKeys) : env;
  return new webpack.DefinePlugin(mapValues(filteredEnv, JSON.stringify));
};

// Enable hot module replacement
export const hotModuleReplacementPlugin = () =>
  devOrOptimized(new webpack.HotModuleReplacementPlugin(), null);

// Warn if user messes up path casing (ex. /somepath vs /somePath)
export const warnOnInconsistentCasingPlugin = () =>
  devOrOptimized(new CaseSensitivePathsPlugin(), null);

// Restart the dev server after installing a new package
export const restartOnNodeModulesChangePlugin = () =>
  devOrOptimized(new WatchMissingNodeModulesPlugin(), null);

// Extract CSS into separate files, one per JS file that imports CSS
export const extractCssPlugin = (overrideConfig = {}) => {
  const defaultConfig = {
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  };
  return devOrOptimized(
    null,
    new MiniCssExtractPlugin(merge(defaultConfig, overrideConfig)),
  );
};

// Create an asset manifest file
export const createAssetManifestPlugin = (overrideConfig = {}) => {
  const { PUBLIC_PATH } = loadEnv();
  const defaultConfig = {
    fileName: 'asset-manifest.json',
    publicPath: PUBLIC_PATH,
  };
  return new WebpackManifestPlugin(merge(defaultConfig, overrideConfig));
};

// Analyze the contents of the bundle
export const bundleAnalyzerPlugin = (overrideConfig = {}) => {
  const defaultConfig = {
    analyzerMode: 'static',
    openAnalyzer: false,
  };
  return devOrOptimized(
    null,
    new BundleAnalyzerPlugin(merge(defaultConfig, overrideConfig)),
  );
};
