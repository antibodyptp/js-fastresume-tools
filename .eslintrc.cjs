module.exports = {
  root: true,
  env: { es2022: true, node: true },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['dist/', 'node_modules/', 'src/version.ts'],
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jsdoc/recommended-typescript',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
      },
    ],

    'no-restricted-syntax': 'off',

    'prettier/prettier': ['error', { singleQuote: true }],
  },
};
