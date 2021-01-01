import { utils } from '@aperture.io/build-tools';

const { loadEnv, log } = utils;

export const config = () => {
  const { APP_HOST, APP_PORT, PUBLIC_DIR, PUBLIC_PATH, WDS } = loadEnv();

  // Disable dev server by default
  if (WDS !== 'true') {
    log('Skipping Webpack Dev Server config');
    return undefined;
  }

  log('Loading Webpack Dev Server config');

  return {
    clientLogLevel: 'none',
    compress: true,
    contentBase: PUBLIC_DIR,
    disableHostCheck: true,
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    port: APP_PORT,
    public: `${APP_HOST}:${APP_PORT}`,
    publicPath: PUBLIC_PATH,
    stats: { children: false, modules: false },
    watchContentBase: true,
    watchOptions: { ignored: /node_modules/ },
  };
};
