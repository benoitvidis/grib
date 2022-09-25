module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    __DEV__: false,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  plugins: ['sort-keys-fix'],
  rules: {
    // avoid loose comparisons
    eqeqeq: ['error', 'smart'],
    'no-console': ['error', { allow: ['error'] }],
    'no-prototype-builtins': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'require-atomic-updates': 0,
    semi: ['error', 'never'],
    'sort-keys': 2,
    'sort-keys-fix/sort-keys-fix': 'warn',
    'valid-jsdoc': [
      'warn',
      {
        requireParamDescription: false,
        requireReturn: false,
        requireReturnDescription: false,
      },
    ],
  },
}
