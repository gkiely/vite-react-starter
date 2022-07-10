/**
 * Description:
 * Run wrangler as a vite plugin
 */

import { spawn } from 'node:child_process';
import type { Plugin } from 'vite';

type Params = {
  path?: string;
  port?: number;
  local?: boolean;
};

const startServer = ({ path, port, local }: Params) => {
  // Restart
  if (global.child) global.child.kill();

  // Spawn
  const child = spawn('wrangler', ['dev', '--port', `${port}`, local ? '--local' : '', path], {
    stdio: 'inherit',
  });

  // Clean up
  child.on('close', code => {
    if (code === 0 && child.killed) return;
    delete global.child;
    process.exit();
  });

  // Set global
  global.child = child;
};

const wranglerPlugin = ({ path = 'index.ts', port = 8080, local = true } = {}): Plugin => {
  let hotUpdatePath = '';
  return {
    name: 'wrangler',
    configureServer: server => {
      // It takes wrangler 300ms to restart
      // delay request until server is ready
      server.middlewares.use(async (req, _res, next) => {
        if (hotUpdatePath.endsWith(path) && req.url.includes(path)) {
          await new Promise(resolve => setTimeout(resolve, 300));
          hotUpdatePath = '';
        }
        next();
      });
    },
    handleHotUpdate(ctx) {
      hotUpdatePath = ctx.file;
    },
    buildStart() {
      hotUpdatePath = global.child ? '' : path;
      if (!global.child) {
        startServer({ path, port, local });
      }
    },
  };
};

export default wranglerPlugin;
