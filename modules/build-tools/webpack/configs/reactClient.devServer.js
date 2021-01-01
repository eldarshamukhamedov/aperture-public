import { utils } from '@aperture.io/build-tools';

export const createConfig = () => {
  const { APP_HOST, APP_PORT, PUBLIC_DIR, PUBLIC_PATH, WDS } = utils.loadEnv();

  // Disable dev server by default
  if (WDS !== 'true') {
    utils.log('Skipping Webpack Dev Server config');
    return undefined;
  }

  utils.log('Loading Webpack Dev Server config');

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
