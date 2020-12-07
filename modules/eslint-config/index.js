export default {
  extends: ['airbnb-base', 'airbnb/rules/react', 'prettier', 'prettier/react'],
  plugins: ['babel'],
  parser: 'babel-eslint',
  env: {
    jest: true,
    browser: true,
    node: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'lines-between-class-members': 0,
    'prefer-destructuring': 0,
    'react/jsx-filename-extension': 0,

    // Use the `eslint-babel-plugin` version of `no-unused-expressions` to
    // support optional chaining operators
    'babel/no-unused-expressions': 2,
    'no-unused-expressions': 0,

    // Some libraries, such as Immer, rely on direct parameter assignment
    'no-param-reassign': [
      2,
      {
        props: true,
        ignorePropertyModificationsFor: ['draft', 'req', 'res', 'ctx'],
      },
    ],

    // Forbid the use of imperative loops and classes
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ClassDeclaration',
        message: 'Using `class` is not allowed. Use factory functions instead',
      },
      {
        selector: 'ForStatement',
        message: 'Using `for` is not allowed. Use collection functions instead',
      },
      {
        selector: 'DoWhileStatement',
        message:
          'Using `do while` is not allowed. Use collection functions instead',
      },
      {
        selector: 'WhileStatement',
        message:
          'Using `while` is not allowed. Use collection functions instead',
      },
    ],
  },

  // Typescript-specific rules
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      rules: {
        'no-undef': 0,

        // Use the `typescript-eslint` version of `no-unused-vars`
        '@typescript-eslint/no-unused-vars': 2,
        'no-unused-vars': 0,
      },
    },
  ],
};
