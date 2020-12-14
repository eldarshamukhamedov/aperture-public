# Aperture Public

## Setup

Install all of the OS-level dependecies:

- Git, Node, NPM, `n`-version manager, Docker, Docker Compose, Terraform
- VS Code, or another editor with TS, ESLint, and Prettier support
- `libpq-dev` for the `pg` and `pg-native` NPM modules

Switch to the monorepo Node version:

```sh
n $(cat .node-version)
```

## Scripts

```sh
yarn                                  # Install monorepo NPM dependencies
yarn start                            # Start everything
yarn start --scope="<NPM package>"    # Start a specific app
yarn start:docker                     # Start up Docker dev environment
yarn start:typescript                 # Start Typescript compiler
yarn test                             # Run all tests
yarn test:functional                  # Run Cypress functional tests
yarn lint                             # Check for ESLint issues
yarn format:check                     # Check for Prettier issues
yarn format:fix                       # Fix Prettier issues
yarn types:check                      # Check for Typescript errors
yarn clean                            # Remove all dependencies
```

## Code organization

```sh
/apps                         # Browser and native apps, backend services, lambdas
  /api-gateway                # GraphQL endpoint
  /example-react-client       # Example React client app

/modules                      # Libraries, frameworks, shared configs, utilities
  /babel-config               # Monorepo Babel config
  /eslint-config              # Monorepo ESLint config
  /jest-config                # Monorepo jest config
  /example-react-library      # Example React library
  /terraform                  # Terraform modules
```

## Tips

```sh
# Run an NPM script in an NPM package
yarn lerna run <NPM script> --scope="<NPM package>"

# Run an NPM script in all packages in parallel
yarn lerna run --parallel <NPM script>

# Execute a bash command
yarn lerna exec "ls -la"
yarn lerna exec "ls -la" --scope="<NPM package>"
```
