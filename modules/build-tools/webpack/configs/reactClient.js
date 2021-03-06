import { resolve as resolvePath, relative as relativePath } from 'path';
import { utils, webpack } from '@aperture.io/build-tools';

export const createConfig = async (createDevServerConfig) => {
  const env = utils.loadEnv();

  utils.log('Package version:', env.PACKAGE_VERSION);
  utils.log('Code version key:', env.CODE_VERSION_KEY);
  utils.log(
    utils.devOrOptimized(
      'Building a development bundle',
      'Building a production-optimized bundle',
    ),
  );
  utils.log('Git info:', utils.getGitInfo());
  utils.log('Environment variables:', env);

  return {
    // Switch between developer-optimized and productio-optimized build modes.
    // In development mode, Webpack compiles faster and outputs human-readable
    // chunk names. In production mode, compilation is slower and chunk names
    // are mangled. Production mode also enables other optimizations.
    // More details: https://webpack.js.org/configuration/mode/
    mode: utils.devOrOptimized('development', 'production'),

    // Webpack can compile for multiple environments (aka targets). The most
    // commont targets are `web` (browsers) and `node` (servers)
    // More details:
    // https://webpack.js.org/concepts/targets/
    // https://webpack.js.org/configuration/target/
    target: env.WEBPACK_TARGET || 'web',

    // The base directory path used to resolve all relative paths
    // More details: https://webpack.js.org/configuration/entry-context/#context
    context: env.PACKAGE_ROOT,

    // Application entry points, aka the module where Webpack starts bundling.
    // Each entry point will produce a separate bundle. In development mode,
    // `webpackHotDevClient` is used to enable hot module reloading. More
    // complex apps and libraries might have multiple entry points.
    // More details:
    // https://webpack.js.org/concepts/entry-points/
    // https://webpack.js.org/configuration/entry-context/#entry
    entry: [
      utils.devOrOptimized('react-dev-utils/webpackHotDevClient', null),
      env.ENTRY,
    ].filter(Boolean),

    // Rules for resolving modules (e.g. where from and how to load code and
    // other assets). Paths are relative to the `context` value.
    // More details:
    // https://webpack.js.org/concepts/module-resolution/
    // https://webpack.js.org/configuration/resolve/
    resolve: {
      modules: [
        'node_modules',
        env.NODE_MODULES,
        env.SOURCE_DIR,
        env.PACKAGE_ROOT,
      ],
      extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
    },

    // Rules for loading and transforming modules that make up a bundle.
    // More details:
    // https://webpack.js.org/concepts/modules/
    // https://webpack.js.org/configuration/module/
    module: {
      strictExportPresence: true,
      rules: [
        // Resolve all file imports. You typically only want one set of loaders
        // to match any given import.
        {
          oneOf: [
            // JS and TS imports
            {
              test: /\.(jsx?|mjs|tsx?)$/,
              // Don't compile node_modules, except for other symlinked monorepo packages
              exclude: /node_modules\/(?!(@aperture.io\/*)\/).*/,
              use: [webpack.loaders.babelLoader()],
            },

            // CSS imports
            {
              test: /\.css$/,
              use: [
                webpack.loaders.inlineStylesLoader(),
                webpack.loaders.extractStylesToFileLoader(),
                webpack.loaders.cssLoader({ importLoaders: 1 }),
                webpack.loaders.postCssLoader(),
              ].filter(Boolean),
            },

            // SCSS imports
            {
              test: /\.scss$/,
              sideEffects: true,
              use: [
                webpack.loaders.inlineStylesLoader(),
                webpack.loaders.extractStylesToFileLoader(),
                webpack.loaders.cssLoader({ importLoaders: 2 }),
                webpack.loaders.postCssLoader(),
                webpack.loaders.sassLoader(),
              ].filter(Boolean),
            },

            // Asset module imports
            // Webpack 5 uses asset modules to handle asset files (fonts, icons,
            // images, etc.). These are the types we use:
            // - `asset/resource`: emit separate file, export URL
            // - `asset/inline`: exports base64 data URI
            // - `asset`: varies by asset file size:
            //   - <8kb, acts as `asset/inline`
            //   - >=8kb acts as `asset/resource`
            // More details:
            // https://webpack.js.org/guides/asset-modules/
            // https://webpack.js.org/guides/asset-modules/#resource-assets
            // https://webpack.js.org/guides/asset-modules/#general-asset-type
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
            },
            {
              // Catch-all for everything else
              exclude: [/\.(js|jsx|mjs|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
          ],
        },
      ],
    },

    // Rules that tell Webpack how and were to emit bundles.
    // More details:
    // https://webpack.js.org/configuration/output/
    // https://webpack.js.org/concepts/output/
    output: {
      // Output directory path
      path: env.BUILD_DIR,
      filename: utils.devOrOptimized(
        'static/js/[name].js',
        'static/js/[name].[contenthash:8].js',
      ),
      chunkFilename: utils.devOrOptimized(
        'static/js/[name].chunk.js',
        'static/js/[name].[contenthash:8].chunk.js',
      ),
      // Public URL of the output directory, used to load static assets. Can be
      // a relative or an absolute path. `/` is the typical value for CRA-like
      // apps.
      publicPath: env.PUBLIC_PATH || '/',
      // Customize sourcemap filenames/paths
      devtoolModuleFilenameTemplate: utils.devOrOptimized(
        // Point sourcemaps to original disk location in development
        (info) => resolvePath(info.absoluteResourcePath),
        // Use relative paths in production
        (info) => relativePath(env.SOURCE_DIR, info.absoluteResourcePath),
      ),
    },

    // Plugins used to customize the build process.
    // More details:
    // https://webpack.js.org/plugins/
    // https://webpack.js.org/configuration/plugins/
    plugins: [
      webpack.plugins.providePlugin(),
      webpack.plugins.eslintPlugin(),
      webpack.plugins.circularDependencyPlugin(),
      webpack.plugins.htmlWebpackPlugin(),
      webpack.plugins.interpolateHtmlPlugin(),
      webpack.plugins.copyFaviconPlugin(),
      webpack.plugins.injectEnvVarsPlugin(),
      webpack.plugins.hotModuleReplacementPlugin(),
      webpack.plugins.warnOnInconsistentCasingPlugin(),
      webpack.plugins.restartOnNodeModulesChangePlugin(),
      webpack.plugins.extractCssPlugin(),
      webpack.plugins.createAssetManifestPlugin(),
      webpack.plugins.bundleAnalyzerPlugin(),
    ].filter(Boolean),

    // Configure Webpack bundle optimizations, such as minimization and
    // automatic chunk-splitting
    // More details: https://webpack.js.org/configuration/optimization/
    optimization: {
      minimize: utils.devOrOptimized(false, true),
      minimizer: [
        webpack.plugins.minimizeJsPlugin(),
        webpack.plugins.minimizeCssPlugin(),
      ],
      // Options used by the internal SplitChunksPlugin to automatically create
      // chunks for reused code.
      // More details: https://webpack.js.org/plugins/split-chunks-plugin/
      splitChunks: { chunks: 'all' },
      // The Webpack runtime chunk is used to load other bundle chunks
      runtimeChunk: true,
    },

    // Determines whether to error out on the first encountered error, or keep
    // bundling and log all errors at the end. Since production-optimized
    // bundles are usually generated in a CI environment, we want to bail as
    // quickly as possible.
    // More details: https://webpack.js.org/configuration/other-options/#bail
    bail: utils.devOrOptimized(false, true),

    // Disable noisy large bundle filesize warnings unless debugging
    performance: { hints: env.WEBPACK_DEBUG === 'true' },

    // Determines the type of source maps that are generated. There are many
    // strategies for generating source maps, with time vs. quality being the
    // main trade-off. In development, `eval-source-map` is slow to generate
    // the initial set of source maps, but quick to re-build/update them after
    // a file change. `source-map` is the higher-quality option, but is very
    // slow, so it is best used for production-optimized bundles, where source
    // maps are uploaded to third-party services (e.g. Sentry/Bugsnag).
    // More details: https://webpack.js.org/configuration/devtool/
    devtool: utils.devOrOptimized('eval-source-map', 'source-map'),

    // Configure WebpackDevServer. WDS is optimized for development workflows
    // and should not be used when building production-optimized bundles. WDS
    // uses an in-memory filesystem and other optimizations to achieve <1s build
    // times.
    // More details: https://webpack.js.org/configuration/dev-server/
    devServer: utils.devOrOptimized(createDevServerConfig(), undefined),
  };
};
