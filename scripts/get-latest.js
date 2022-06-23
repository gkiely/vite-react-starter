const package = require('../package.json');

const deps = Object.keys(
  {
    ...package.dependencies,
    ...package.devDependencies,
  }
).join('@latest ') + '@latest';

console.log(deps);
