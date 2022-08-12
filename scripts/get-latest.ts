/* eslint-disable prefer-template */
import packageJSON from '../package.json';

const deps = (
  Object.keys({
    ...packageJSON.dependencies,
    ...packageJSON.devDependencies,
  }).join('@latest ') + '@latest'
).replace('typescript@latest ', '');

// Output to shell
console.log(deps);
