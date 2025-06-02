module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: 'test-report.html', 
        includeFailureMsg: true,
        includeConsoleLog: true,
        theme: 'lightTheme'
      }
    ]
  ],
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'lcov'],
  coverageDirectory: './coverage'
};