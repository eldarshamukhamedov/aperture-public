export default {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/source/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/source/**/*.d.ts',
    '!<rootDir>/source/**/__tests__/**/*.{js,jsx,ts,tsx}',
  ],
  modulePaths: ['<rootDir>/', '<rootDir>/source'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFiles: [
    '<rootDir>config/jest/setupEnzyme.js',
    '<rootDir>config/jest/mocks.js',
  ],
  testURL: 'http://localhost:8080',
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.(js,jsx)$': 'babel-jest',
    '^.+\\.(ts,tsx)$': 'ts-jest',
    '^.+\\.(svg)$': '<rootDir>/config/jest/fileTransform.js',
  },
};
