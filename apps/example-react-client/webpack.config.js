import { webpack } from '@aperture.io/build-tools';

export default webpack.configs.createReactClientConfig(
  webpack.configs.createReactClientDevServerConfig,
);
