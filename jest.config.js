module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/index.js',
  ],
  transform: {
    '^.+\\.(js|jsx)$': ['@swc/jest'],
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/__tests__/unit/**/*.{js,jsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.(js|jsx)$': ['@swc/jest'],
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/src/**/__tests__/integration/**/*.{js,jsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.(js|jsx)$': ['@swc/jest'],
      },
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/src/**/__tests__/e2e/**/*.{js,jsx}'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.(js|jsx)$': ['@swc/jest'],
      },
    },
  ],
}
