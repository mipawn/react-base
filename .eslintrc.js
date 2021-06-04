module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'react-app/base',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 'airbnb-typescript'
    require.resolve('@umijs/fabric/dist/eslint')
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    createDefaultProgram: true,
  },
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  rules: {
    '@typescript-eslint/semi': [ 2, 'never', { beforeStatementContinuationChars: 'always' }],
    '@typescript-eslint/no-unused-vars': 1,
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'import/no-named-as-default': 0,
    'no-param-reassign': 0,
    'no-console': 0
  },
}
