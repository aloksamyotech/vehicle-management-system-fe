import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = '3000';

  return {
    server: {
      open: true,
      port: PORT,
      proxy: {
        '/api': {
          target: 'http://localhost:7600',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      global: 'window'
    },
    resolve: {},
    preview: {
      open: true,
      port: PORT
    },
    plugins: [react(), jsconfigPaths()]
  };
});
