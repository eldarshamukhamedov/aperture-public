// The base Airbnb ruleset is great, but is a little too strict in some cases,
// so we override a handful of them for increased flexibility.
const airbnbOverrideRules = {
  // Relax arrow function body rules for more flexibility.
  // Ex. Allow `const fn = () => { return 1; }`
  'arrow-body-style': 'off',
  // Relax class member spacing rules for more flexibility.
  'lines-between-class-members': 'off',
  // Some libraries, such as Immer, rely on direct parameter assignment.
  // Reassigning function parameters can result in hard-to-debug mutability
  // bugs. For instance, if a third-party library passes an object to a callback
  // in our code, but holds on to a reference to that object, when we mutate
  // the object, there's a chance that we will break some third-party code. For
  // this reason, we disallow parameter reassignment by default. However, there
  // are cases where reassignment is unavoidable. In the case of Immer, the
  // passed object (`draft`) is guaranteed to be cloned, so we can mutate it
  // safely. In case of ExpressJS/Koa, `req`, `res`, and `ctx` values cannot
  // be cloned without losing important HTTP/network stack state. For these
  // cases, we add exceptions to the reassignment rule.
  'no-param-reassign': [
    'error',
    {
      props: true,
      ignorePropertyModificationsFor: ['draft', 'req', 'res', 'ctx'],
    },
  ],
  // Destructuring is great, but requiring it forces each object member to have
  // a unique name in the scope. It is sometimes clearer to hold on to the
  // parent object name (e.g. `apis.getUser` instead of just `getUser`).
  'prefer-destructuring': 'off',
};

// Babel allows us to add support for experimental/proposal-stage language
// features that ESLint base rules don't support, resulting in false positives.
// Here, we can override base ESLint rules with Babel equivalents.
const babelRules = {
  // Use the `eslint-babel-plugin` version of `no-unused-expressions`
  'no-unused-expressions': 'off',
  'babel/no-unused-expressions': 'error',
};

// These rules deal with module import and export statements.
// See full set of eslint-plugin-import rules:
// https://www.npmjs.com/package/eslint-plugin-import
const importRules = {
  // Don't require extensions for JS and TS module imports
  'import/extensions': [
    'error',
    'ignorePackages',
    { js: 'never', mjs: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
  ],
  // Don't error when importing dependencies not listed in package.json files.
  // This is useful for Node scripts that rely on global NPM packages.
  'import/no-extraneous-dependencies': 'off',
  // Allow more flexibility when it comes to default exports
  'import/no-named-as-default-member': 'off',
  'import/no-named-as-default': 'off',
  'import/prefer-default-export': 'off',
};

// Most of the React/hooks rules come from the Airbnb base config, but we add
// a handful of overrides here.
// See full set of eslint-plugin-react and eslint-plugin-react-hooks rules:
// https://www.npmjs.com/package/eslint-plugin-react#list-of-supported-rules
// https://reactjs.org/docs/hooks-rules.html
const reactRules = {
  // Allow `.js` files to contain JSX
  'react/jsx-filename-extension': 'off',
  // Prop spreading should be used with care, but can be powerful when extending
  // UI library components.
  'react/jsx-props-no-spreading': 'off',
  // Error when hooks are not passed all dependencies. This is critical for
  // predictable behavior when React concurrent mode is enabled, but can make
  // writing effect hooks much more challenging. Users can still override this
  // rule as needed with eslint-disable-next-line, or similar.
  // More details: https://reactjs.org/docs/concurrent-mode-intro.html
  'react-hooks/exhaustive-deps': [
    'error',
    // Match custom effect hooks that you want to enforce this rule for here
    // { additionalHooks: '()' }
  ],
  // With Typescript, type checks are sufficient to ensure default prop values
  // are always set.
  'react/require-default-props': 'off',
};

// This rule relies on ESLint's abstract syntax tree (AST) parser selectors.
// Developers write code with different styles, add comments and arbitrary
// whitespace, etc. Before a compiler can process a piece of code, it has to
// convert it to a standardized representation without all of the stylistic
// content;. this is called an AST. For example, take two JS files with the same
// logic, but one uses tabs, and another uses spaces. To the developer, the two
// files look different, but they will produce the same AST. Here, we use AST
// selectors to forbid use of specific types of JS syntax.
// More details:
// https://eslint.org/docs/rules/no-restricted-syntax
// https://astexplorer.net/
const restrictedSyntaxRules = {
  'no-restricted-syntax': [
    'error',
    // Disallow class declarations by default. Object composition is preferred,
    // and this rules helps discourage class inheritence pitfalls (decreased
    // readability, unclear intent, mutable prototype bugs, etc.).
    {
      selector: 'ClassDeclaration',
      message: 'Using `class` is not allowed. Use factory functions instead',
    },

    // Disallow imperative loops. These are loops based on index-tracking, and
    // often result in "array out of bounds" and "off by one" type of errors.
    // Collection functions (forEach/map/filter) and loops (for-in/for-of) are
    // almost always safer.
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
      message: 'Using `while` is not allowed. Use collection functions instead',
    },
  ],
};

// Typescript files use a different parser and set of lint rules, so we override
// some of the base rules here. For most rules, we fallback to the JS ruleset.
// More details: https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
const typescriptRules = {
  // Use the `typescript-eslint` version of `no-unused-vars`
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'error',

  // Use the `typescript-eslint` version of `no-use-before-define`
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': 'error',
};

module.exports = {
  importRules,
  reactRules,
  restrictedSyntaxRules,
  typescriptRules,
  babelRules,
  airbnbOverrideRules,
};
