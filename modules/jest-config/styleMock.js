// Webpack allows us to import styles (CSS/SASS) directly in our JS/TS modules.
// Since Jest typically uses JSDom as the test environment, it doesn't know how
// to process style imports, so we mock them out.
// More details: https://jestjs.io/docs/en/webpack
module.exports = {};
