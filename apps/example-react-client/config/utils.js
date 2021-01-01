import { realpathSync, readFileSync } from 'fs';
import { once, merge } from 'lodash';
import git from 'git-rev-sync';
import dotenv from 'dotenv';

// Toggle between two values based on condition. When the `selector` function
// returns a truthy value, the `match` value is returned; otherwise, the
// `fallback` value is returned. This is handy for configuration files where
// you need to toggle between development and production options in the same
// file.
// fn (selector: (match, fallback) => boolean) => (match, fallback) => value
export const toggle = (selector = () => false) => (match, fallback) =>
  selector(match, fallback) ? match : fallback;

// Toggle between development and production-optimized options
// fn (dev, optimized) => value
export const devOrOptimized = toggle(() => process.env.OPTIMIZED !== 'true');

// Toggle between skipping or uploading source maps
// fn (upload, skip) => value
export const uploadSourceMaps = toggle(() =>
  ['staging', 'production'].includes(process.env.NODE_ENV),
);

// Get current Git info, such as the latest (HEAD) commit SHA and message, and
// whether there are any unstaged or uncommitted changes.  This is useful for
// detecting code changes that have not yet been logged as a separate release.
export const getGitInfo = once(() => ({
  short: git.short(),
  long: git.long(),
  branch: git.branch(),
  date: git.date(),
  message: git.message(),
  hasUnstagedChanges: git.hasUnstagedChanges(),
  isDirty: git.isDirty(),
  tag: git.tag(),
}));

// Resolve an absolute path to the package root. This is *not* the monorepo
// path, but rather the path to a specific package within the monorepo.
// Ex. `/Users/bob/monorepo/app/example-app`, NOT `/users/bob/monorepo`
export const getPackageRoot = once(() => realpathSync(process.cwd()));

// Get the contents of a `package.json` file for a monorepo package
export const getPackageJson = once((packageRoot = getPackageRoot()) =>
  JSON.parse(readFileSync(`${packageRoot}/package.json`)),
);

// Get the version of a monorepo package from the `package.json` file
export const getPackageVersion = (packageRoot = getPackageRoot()) =>
  getPackageJson(packageRoot).version || 'unknown';

// Get the code version key. This key is created by combining the HEAD Git
// commit SHA and the package version. It is used in situations where a
// package version alone is not specific enough to identify a code change, such
// as when uploading sourcemaps. A commit SHA alone could also surve this
// purpose, but having the package version as part of the key makes it more
// human-readable in apps like Sentry or Bugsnag.
export const getCodeVersionKey = (packageRoot = getPackageRoot()) =>
  `${getPackageVersion(packageRoot)}-${getGitInfo().short}`;

// Load and return environment variables from a combination of `.env` files,
// the Node process, and a number of monorepo helpers. The combined set of
// environment variables are also synced back to the Node process.env object
// to prevent the build context and the process from falling out of sync.
// Load and override order:
// 1. Computed build variables (e.g. `PACKAGE_ROOT` or `NODE_ENV`)
// 2. Base environment variables (e.g. `.env.production` or `.env.development`)
// 3. User environment overrides from the local `.env` file
const DEFAULT_ENVIRONMENTS = ['development', 'production', 'testing'];
export const loadEnv = once((environments = DEFAULT_ENVIRONMENTS) => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const OPTIMIZED = process.env.OPTIMIZED || 'false';
  const PACKAGE_ROOT = getPackageRoot();
  const WDS = process.env.WDS || 'false';

  if (environments.includes(NODE_ENV)) {
    // Environment variables used by Webpack
    const buildEnv = {
      // Webpack build output directory
      BUILD_DIR: `${PACKAGE_ROOT}/build`,
      // Code version key used for source map uploads
      CODE_VERSION_KEY: getCodeVersionKey(),
      // Webpack compiler entry point
      ENTRY: `${PACKAGE_ROOT}/source/index.tsx`,
      // Node environment
      NODE_ENV,
      // Path to package node_modules folder
      NODE_MODULES: `${PACKAGE_ROOT}/node_modules`,
      // Flag that determines whether to build a fast development or a slow, but
      // production-optimized bundle
      OPTIMIZED,
      // Path to the package root
      PACKAGE_ROOT,
      // Package version
      PACKAGE_VERSION: getPackageVersion() || 'unknown',
      // Path to the public directory, which contains static assets
      PUBLIC_DIR: `${PACKAGE_ROOT}/public`,
      // Browser URL path from which the app will be served
      PUBLIC_PATH: '/',
      // Path to the source folder, which contains all application logic
      SOURCE_DIR: `${PACKAGE_ROOT}/source`,
      // Flag that determines whether the Webpack Dev Server should be loaded
      WDS,
      // Webpack compiler target environment (e.g. web app, server, library)
      WEBPACK_TARGET: 'web',
    };

    // Base environment variables checked into Git
    const baseEnv = dotenv.config({
      path: `${getPackageRoot()}/.env.${NODE_ENV}`,
    }).parsed;

    // Local environment variable overrides not checked into Git
    const overrideEnv = dotenv.config({
      path: `${getPackageRoot()}/.env`,
    }).parsed;

    // Combine all environment variables. Order matters!
    const combinedEnv = { ...buildEnv, ...baseEnv, ...overrideEnv };

    // Update the Node process.env with the combined environment variables
    process.env = merge(process.env, combinedEnv);

    // Return the combined environment variables. We do not return process.env
    // to avoid extraneous environment variables from leaking into the build
    // context.
    return combinedEnv;
  }

  throw new Error(`${NODE_ENV} is not a valid NODE_ENV value`);
});

// Config logger, namespaced with the app name. Objects are pretty-printed.
export const log = (...args) => {
  const { APP_NAME } = loadEnv();
  const prettyPrint = (value) => JSON.stringify(value, null, 2);
  // eslint-disable-next-line
  console.log(`[${APP_NAME || 'WebpackBuild'}]`, ...args.map(prettyPrint));
};
