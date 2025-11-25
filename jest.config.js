module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'App.js',
    'components/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
};
