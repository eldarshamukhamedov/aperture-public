# Analytics library

Declarative and compartmentalized library for React analytics, heavily inspired by the New York Times' blog post on [declarative React tracking](https://open.nytimes.com/introducing-react-tracking-declarative-tracking-for-react-apps-2c76706bb79a).

## TL;DR

1. Components define only the event data that's relevant to them.
2. When an event is triggered, event data is deeply-merged all the way up the component tree.
3. Finally, the combined event data is pushed to analytics provider.

## Intro

### Root-level data

First, define a root-level set of event data and a `dispatch` function handling events:

```jsx
import { useAnalytics } from '@aperture.io/analytics';

export const AppRoot = ({ children }) => {
  const { Provider } = useAnalytics(
    // Shared event data
    { app: 'MyApp' },
    // Dispatch function to handle triggered events
    { dispatch: (eventData) => console.log('dispatch', eventData) },
  );

  return <Provider>{children}</Provider>;
};
```

Here, the `<Provider />` component defines a new analytics context. All children down-tree of the provider will inherit its event data, in this case, `{ app: 'MyApp' }`.

The `dispatch` function is called whenever an event is triggered by one of the children. This is where you'd integrate with analytics providers such as Amplitude or Mixpanel.

### Local component data

We add some local event data in child components as needed. Here is a newsletter sign up form:

```jsx
import { useAnalytics } from '@aperture.io/analytics';
import { Form, FormLabel, Input, Button } from '@chakra-ui/react';

export const NewsletterForm = ({ handleSubmit }) => {
  const { trackEvent } = useAnalytics(
    // Shared event data
    { module: 'NewsletterForm' },
  );

  return (
    <Form
      onSubmit={(event) => {
        handleSubmit(event);
        // Event data specific to form submission
        trackEvent({ action: 'submit-form' });
      }}
    >
      <FormLabel>Sign up for our newsletter!</FormLabel>
      <Input
        placeholder="Email address"
        onFocus={() => {
          // Event data specific to focusing the email input
          trackEvent({ action: 'email-input-focused' });
        }}
      />
      <Button type="submit">Sign up!</Button>
    </InputGroup>
  );
};
```

We are setting some component-level event data and dispatching a couple of events with data specific to the different cases (e.g. `action: 'submit-form` when the form is submitted).

When a user focuses the input, the data passed to `trackEvent` is merged with the shared component data, and we get this object as the result:

```js
{ module: 'NewsletterForm', action: 'email-input-focused' }
```

When, instead, the form is submitted, we get a different merged event object:

```js
{ module: 'NewsletterForm', action: 'submit-form' }
```

### Dispatch event on component mount

You can also dispatch an event when a component mounts. This is useful for tracking page views:

```jsx
import { useAnalytics } from '@aperture.io/analytics';
import { NewsletterForm } from './NewsletterForm';

export const HomePage = () => {
  const { Provider } = useAnalytics(
    { page: 'HomePage' },
    // Trigger an event when the component is mounted
    { dispatchOnMount: true },
  );
  return (
    <Provider>
      <NewsletterForm />
    </Provider>
  );
};
```

### Putting everything together

Now let's put all of the pieces together:

```jsx
import ReactDOM from 'react-dom';
import { AppRoot } from './AppRoot';
import { HomePage } from './HomePage';

ReactDOM.render(
  <AppRoot>
    <HomePage />
  </AppRoot>,
  document.getElementById('root'),
);
```

When our app is loaded, `<AppRoot />` creates a top-level analytics context:

```js
{
  // From <AppRoot />
  app: 'MyApp',
}
```

`<HomePage />` is immediately mounted as well. Since we passed `dispatchOnMount: true` to the `useAnalytics` hook, our first event is triggered automatically:

```js
{
  // From <AppRoot />
  app: 'MyApp',
  // From <HomePage />
  page: 'HomePage',
}
```

Next, the user focuses the input field in `<NewsletterForm />`, so get our next event:

```js
{
  // From <AppRoot />
  app: 'MyApp',
  // From <HomePage />
  page: 'HomePage',
  // From <NewsletterForm />'s component-level event data
  module: 'NewsletterForm',
  // From <NewsletterForm />'s input onFocus handler
  action: 'email-input-focused',
}
```

Finally, the user submits the form data and we get our last event:

```js
{
  // From <AppRoot />
  app: 'MyApp',
  // From <HomePage />
  page: 'HomePage',
  // From <NewsletterForm />'s component-level event data
  module: 'NewsletterForm',
  // From <NewsletterForm />'s input onFocus handler
  action: 'submit-form',
}
```

That's it!

## Public API

```ts
// Types
type UseAnalytics = (
  // Shared analytics data
  eventData: Object,
  // Configuration object
  options: {
    // Dispatch event handler
    dispatch: (data: Object) => void;
    // Whether to dispatch an event on component mount
    dispatchOnMount: true;
  },
) => {
  // Localized analytics provider
  Provider: React.Provider<Object>;
  // trackEvent function
  trackEvent: (data: Object) => void;
};

// Exports
export const useAnalytics: UseAnalytics = /* ... */;
```

## Scripts

```sh
yarn build                            # Build library bundle
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
/scripts                              # Dev and publish scripts
/source                               # Library source files
  /index.ts                           # Library entry point
/.eslint.json                         # Local ESLint configuration
/babel.config.js                      # Local Babel configuration
/jest.config.json                     # Local Jest configuration
/jsconfig.json                        # JS config, primarily used by code editors to resolve path aliases
/tsconfig.json                        # TS configuration
/webpack.config.json                  # Local Webpack configuration
```
