/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {
    chrome: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowImportExportEverywhere: true,
    parser: '@babel/eslint-parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
}
