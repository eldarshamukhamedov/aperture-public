// Webpack allows us to import arbitrary file directly in our JS/TS modules.
// Since Jest typically uses JSDom as the test environment, it doesn't know how
// to process non-JS file imports, so we mock them out.
// More details: https://jestjs.io/docs/en/webpack
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
