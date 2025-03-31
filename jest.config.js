module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@backend/(.*)$': '<rootDir>/backend/$1', 
    '^@frontend/(.*)$': '<rootDir>/frontend/src/$1', 
  },
  roots: ['<rootDir>/backend', '<rootDir>/frontend', '<rootDir>/test'],
};