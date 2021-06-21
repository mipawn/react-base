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
    'airbnb-typescript'
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
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'import/prefer-default-export': 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    'import/no-named-as-default': 0,
    'no-param-reassign': 0,
    'no-console': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      tsx: 'never',
      ts: 'never'
    }],
    'react/prop-types': 0,
    'arrow-body-style': [2, "as-needed"],
    "import/no-named-as-default-member": 0,
    "arrow-parens": 0,
    "arrow-body-style": 0,
    "@typescript-eslint/no-unused-expressions": 0,
    "consistent-return": 0,
    'react/no-array-index-key': 0
  },
}
