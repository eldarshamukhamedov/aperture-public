module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/source/**/*.{js,mjs,jsx,ts,tsx}',
    '!<rootDir>/source/**/__tests__/**/*.{js,mjs,jsx,ts,tsx}',
  ],
  modulePaths: ['<rootDir>/', '<rootDir>/source'],
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['@aperture.io/jest-config/setupTests.js'],
  testMatch: ['<rootDir>/source/**/__tests__/**/*.test.{js,mjs,jsx,ts,tsx}'],
  testURL: 'http://localhost:8080',
  transform: {
    '^.+\\.(js|mjs|jsx|json)$': 'babel-jest',
    '^.+\\.(css|scss)$': '@aperture.io/jest-config/styleMock.js',
    '^.+\\.(bmp|png|svg|woff)$': '@aperture.io/jest-config/fileMock.js',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
