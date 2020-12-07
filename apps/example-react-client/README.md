# Example React client app

## Scripts

```sh
yarn build                            # Build app bundle
yarn serve                            # Serve app bundle locally using a static file server
yarn start                            # Start dev server
yarn test                             # Run Jest tests
yarn test:watch                       # Run Jest tests in watch mode
yarn lint                             # Check for ESLint issues
yarn types                            # Check for Typescript errors
```

## Code organization

```py
/config                               # Build and dev tool configuration (Jest, Webpack)
/dist                                 # Build artifacts destination folder (compiles TS output)
/public                               # Static public assets (`index.html` entry file, fonts)
/scripts                              # Dev and deploy scripts (set env variables, deploy assets to S3/GS buckets)
/source                               # App source files (React components, helpers)
  /:module
    /components                       # React components
    /constants                        # Shared constants
    /helpers                          # Shared helpers
    /hooks                            # Shared hooks
    /types                            # Shared types
    /index.js                         # Export file (only imports/export in this file)
  /core
    /components                       # App entry point and top-level React components
    /constants                        # App-wide shared constants
    /helpers                          # App-wide shared helpers
    /types                            # App-wide shared types
    /index.js                         # App entry point
```
