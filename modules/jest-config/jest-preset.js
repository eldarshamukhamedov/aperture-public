module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/source/**/*.{js,mjs,cjs,jsx,ts,tsx}',
    '!<rootDir>/source/**/__tests__/**/*.{js,mjs,cjs,jsx,ts,tsx}',
  ],
  modulePaths: ['<rootDir>/', '<rootDir>/source'],
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['@aperture.io/jest-config/setupTests.js'],
  testMatch: [
    '<rootDir>/source/**/__tests__/**/*.test.{js,mjs,cjs,jsx,ts,tsx}',
  ],
  testURL: 'http://localhost:8080',
  transform: {
    '^.+\\.(js|mjs|jsx|json)$': 'babel-jest',
    '^.+\\.(css|scss)$': '@aperture.io/jest-config/fileTransformer.js',
    '^.+\\.(bmp|png|svg|woff)$': '@aperture.io/jest-config/fileTransformer.js',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
};
