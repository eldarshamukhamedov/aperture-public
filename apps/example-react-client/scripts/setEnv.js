import dotenv from 'dotenv';

export const setEnv = () => {
  const PACKAGE_ROOT = process.cwd();
  const NODE_ENV = process.env.NODE_ENV || 'development';
  if (['development', 'production', 'testing'].includes(NODE_ENV)) {
    // Merge base environment variables with local overrides. Order matters!
    const baseEnv = dotenv.config({ path: `${PACKAGE_ROOT}/.env.${NODE_ENV}` })
      .parsed;
    const overrideEnv = dotenv.config({ path: `${PACKAGE_ROOT}/.env` }).parsed;
    return { ...baseEnv, ...overrideEnv };
  }

  throw new Error(`${NODE_ENV} is not a valid NODE_ENV value`);
};
