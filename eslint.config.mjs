/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Basic rules - can be expanded as needed
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];

export default eslintConfig;