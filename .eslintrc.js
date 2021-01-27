module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: `./tsconfig.json`,
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  rules: {
    // disable the rule for variables, but enable it for functions and classes
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: true, classes: true, variables: false },
    ],
    '@typescript-eslint/no-var-requires': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 0,
    'global-require': 0,
    'react/no-unescaped-entities': 0,
    'react/jsx-props-no-spreading': 0,
    'react/destructuring-assignment': 0,
    'no-else-return': 0,
  },
}
