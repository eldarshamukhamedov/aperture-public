import { realpathSync } from 'fs';
import { once } from 'lodash';
import shell from 'shelljs';
import dotenv from 'dotenv';
import packageJson from '../package.json';

export const devOrOptimized = (dev, optimized) =>
  process.env.OPTIMIZED === 'true' ? optimized : dev;

export const prettyPrint = (value) => JSON.stringify(value, null, 2);

export const uploadSourceMaps = (upload, skip) =>
  ['staging', 'production'].includes(process.env.NODE_ENV) ? upload : skip;

export const getAppVersionKey = once(() => {
  // Get the current commit SHA (short-form)
  const commitSha = shell
    .exec('git rev-parse --short HEAD', { silent: true })
    .stdout.replace('\n', '');

  return `${packageJson.version}-${commitSha}`;
});

export const getPackageRoot = once(() => realpathSync(process.cwd()));

const DEFAULT_ENVIRONMENTS = ['development', 'production', 'testing'];
export const loadEnv = once((environments = DEFAULT_ENVIRONMENTS) => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const OPTIMIZED = process.env.OPTIMIZED || 'false';
  const WDS = process.env.WDS || 'false';

  if (environments.includes(NODE_ENV)) {
    // Environment variables used by Webpack
    const buildEnv = {
      // Webpack build output
      BUILD_DIR: `${getPackageRoot()}/build`,
      ENTRY: `${getPackageRoot()}/source/index.tsx`,
      NODE_ENV,
      NODE_MODULES: `${getPackageRoot()}/node_modules`,
      OPTIMIZED,
      PACKAGE_ROOT: getPackageRoot(),
      PACKAGE_VERSION: getAppVersionKey() || 'unknown',
      PUBLIC_DIR: `${getPackageRoot()}/public`,
      PUBLIC_PATH: '/',
      SOURCE_DIR: `${getPackageRoot()}/source`,
      WDS,
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

    // Merge all environment variables. Order matters!
    return { ...buildEnv, ...baseEnv, ...overrideEnv };
  }

  throw new Error(`${NODE_ENV} is not a valid NODE_ENV value`);
});

export const log = (...args) => {
  const { APP_NAME } = loadEnv();
  // eslint-disable-next-line
  console.log(`[${APP_NAME || 'WebpackBuild'}]`, ...args);
};
