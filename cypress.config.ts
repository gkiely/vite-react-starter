import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      viteConfig: {
        configFile: './vite.e2e.ts',
      },
      framework: 'react',
      bundler: 'vite',
    },
  },
});
