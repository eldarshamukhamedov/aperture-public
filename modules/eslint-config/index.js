const {
  importRules,
  reactRules,
  restrictedSyntaxRules,
  typescriptRules,
  babelRules,
  airbnbOverrideRules,
} = require('./rules');

module.exports = {
  // As of 12/20/2020:
  // The newer `@babel/eslint-parser` and `@babel/eslint-plugin` packages do not
  // play well with the `eslint-plugin-import` rules, so we fallback to the
  // legacy packages.
  plugins: ['babel'],
  parser: 'babel-eslint',

  // Environments defines global variables that are predefined.
  // More details:
  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: { jest: true, browser: true, node: true },

  // More details:
  // https://eslint.org/docs/user-guide/configuring#adding-shared-settings
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  // This ESLint config combines rules from:
  // 1. The presets from the `extends` list,
  // 2. Custom rules from the `rules` object,
  // 3. File extensions overrides in the `overrides` list (e.g. Typescript)
  // Note that the `prettier` presets mostly *disable* rules, rather than add
  // new ones. This assumes that Prettier is automatically run on the codebase,
  // whether through your editor or Git hooks. This allows us to disable a lot
  // of the ESLint formatting rules and rely on Prettier to fix our formatting
  // instead.
  // More details:
  // https://eslint.org/docs/user-guide/configuring#configuring-rules
  // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
  // https://eslint.org/docs/user-guide/configuring#specifying-processor
  // https://www.npmjs.com/package/eslint-plugin-airbnb
  // https://www.npmjs.com/package/eslint-plugin-prettier
  extends: [
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    ...airbnbOverrideRules,
    ...babelRules,
    ...importRules,
    ...reactRules,
    ...restrictedSyntaxRules,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      rules: { ...typescriptRules },
    },
  ],
};
