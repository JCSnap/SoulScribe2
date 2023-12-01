module.exports = {
    preset: "react-native",
    testEnvironment: 'jsdom',
    transform: {},
    "transformIgnorePatterns": [
      "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
    ],
    moduleFileExtensions: ['js', 'json', 'mjs','tsx'],
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
    moduleNameMapper: {
        '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
      },
  }