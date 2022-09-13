import fs from 'node:fs';
import { ids } from 'machines/machine-utils';
import service from '../machines/router.machine';

// Generate stateIds
const content = fs.readFileSync('./src/app/machines/types.ts', {
  encoding: 'utf-8',
});

const result = `// This file is auto generated and will be overwritten
export type StateIds = '${Array.from(ids).join("'|'")}';`;

if (content !== result) {
  fs.writeFile('./src/app/machines/types.ts', result, () => {});
}

test.todo('', () => expect(service).toBeDefined());
