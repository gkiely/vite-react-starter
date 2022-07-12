/**
 * Description:
 * Run wrangler as a vite plugin
 */
import { spawn } from 'node:child_process';
import type { Plugin } from 'vite';
declare const global: typeof globalThis & {
  child: ReturnType<typeof spawn>;
};

type Params = {
  config: string;
  path: string;
  port: number;
  local: boolean;
};

const startServer = ({ path, port, local, config }: Params) => {
  // Restart
  if (global.child) global.child.kill();

  // Spawn
  const child = spawn(
    'wrangler',
    [
      'dev',
      '--env',
      'development',
      '--port',
      `${port}`,
      local ? '--local' : '',
      ...(config ? ['--config', config] : []),
      path,
    ],
    {
      stdio: 'inherit',
    }
  );

  // Clean up
  child.on('close', code => {
    if (code === 0 && child.killed) return;
    delete global.child;
    process.exit();
  });

  // Set global
  global.child = child;
};

const wranglerPlugin = ({
  path = 'index.ts',
  port = 8080,
  local = true,
  config = '',
} = {}): Plugin => {
  let hotUpdatePath = '';
  return {
    name: 'wrangler',
    configureServer: server => {
      // It takes wrangler 300ms to restart
      // delay request until server is ready
      server.middlewares.use((req, _res, next) => {
        if (hotUpdatePath.endsWith(path) && req.url.includes(path)) {
          const p = new Promise(resolve => setTimeout(resolve, 300));
          p.then(next).catch(() => {});
          hotUpdatePath = '';
        } else {
          next();
        }
      });
    },
    handleHotUpdate(ctx) {
      hotUpdatePath = ctx.file;
    },
    buildStart() {
      hotUpdatePath = global.child ? '' : path;
      if (!global.child) {
        startServer({ path, port, local, config });
      }
    },
  };
};

export default wranglerPlugin;
