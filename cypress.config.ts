import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      viteConfig: {
        configFile: './vite.cypress.ts',
      },
      framework: 'react',
      bundler: 'vite',
    },
  },
});
