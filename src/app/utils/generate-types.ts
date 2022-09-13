/*
  This file is being used to generate the types for state.matches()
  Xstate does not have the capability to type check it
  file output is in ./src/app/machines/types.ts
*/
import fs from 'node:fs';
import { ids } from 'machines/machine-utils';
import service from 'machines/router.machine';

// Generate stateIds
const content = fs.readFileSync('./src/app/machines/generated-types.ts', {
  encoding: 'utf-8',
});

const result = `// This file is auto-generated and will be overwritten
export type StateIds = \n  | '${Array.from(ids).join("'\n  | '")}';\n`;

if (content !== result) {
  fs.writeFileSync('./src/app/machines/generated-types.ts', result);
}

test('', () => expect(service).toBeDefined());
