/*
  This file is being used to generate the types for state.matches()
  Xstate does not have the capability to type check it
  file output is in ./src/app/machines/types.ts
*/
import fs from 'node:fs';
import { idMap } from 'machines/machine-utils';
import service from 'machines/router.machine';

const ids = Object.values(idMap).flat();

// Generate stateIds
const content = fs.readFileSync('./src/app/machines/types.generated.ts', {
  encoding: 'utf-8',
});

const output = `// This file is auto-generated and will be overwritten
export type StateIds = \n  | '${Array.from(ids).join("'\n  | '")}';\n`;

if (content !== output) {
  fs.writeFileSync('./src/app/machines/types.generated.ts', output);
}

test.todo('', () => expect(service).toBeDefined());
