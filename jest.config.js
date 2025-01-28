module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', 
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    testMatch: ['**/*.test.ts', '**/*.test.tsx'], // Matches test files
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
    },
  };
  