import path from 'path';

export const process = (src, filename) => {
  return `module.exports = ${JSON.stringify(path.basename(filename))};`;
};
