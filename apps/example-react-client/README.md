# Example React client app

## Scripts

```sh
yarn build                            # Build app bundle
yarn serve                            # Serve app bundle locally using a static file server
yarn start                            # Start dev server
yarn start:typescript                 # Start Typescript compiler
yarn test                             # Run Jest tests
yarn test:watch                       # Run Jest tests in watch mode
yarn lint                             # Check for ESLint issues
yarn types:check                      # Check for Typescript errors
```

## Code organization

```py
/dist                                 # Build artifacts destination folder (compiles TS output)
/mocks                                # Jest and Cypress test mocks
/public                               # Static public assets (`index.html` entry file, fonts)
/scripts                              # Dev and deploy scripts (set env variables, deploy assets to S3/GS buckets)
/source                               # App source files (React components, helpers)
  /core
    /components                       # App entry point and top-level React components
    /constants                        # App-wide shared constants
    /helpers                          # App-wide shared helpers
    /index.js                         # App entry point
  /:module
    /components                       # React components
    /constants                        # Shared constants
    /helpers                          # Shared helpers
    /hooks                            # Shared hooks
    /types                            # Shared types
    /index.js                         # Export file (only imports/export in this file)
/types                                # App-wide shared types
/.eslint.json                         # Local ESLint configuration
/babel.config.js                      # Local Babel configuration
/jest.config.json                     # Local Jest configuration
/jsconfig.json                        # JS config, primarily used by code editors to resolve path aliases
/tsconfig.json                        # TS configuration
/webpack.config.json                  # Local Webpack configuration
```
