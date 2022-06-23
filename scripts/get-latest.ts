const package = require('../package.json');

const deps =
  Object.keys({
    ...package.dependencies,
    ...package.devDependencies,
  }).join('@latest ') + '@latest';

// Output to shell
console.log(deps);
