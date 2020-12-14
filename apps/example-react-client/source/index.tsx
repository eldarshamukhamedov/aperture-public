import React from 'react';
import ReactDOM from 'react-dom';
import { Entry } from 'core/components/Entry';

function render(ApplicationEntry: React.FunctionComponent) {
  ReactDOM.render(<ApplicationEntry />, document.getElementById('root'));
}
render(Entry);

if (module.hot) {
  // Hot-reload everything down-tree of the store providers, but force full
  // reload if and middleware or reducers are altered.
  module.hot.accept('./core/components/Entry', () => {
    const { Entry: NextEntry } = require('./core/components/Entry'); // eslint-disable-line
    render(NextEntry);
  });
}
