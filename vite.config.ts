import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno (.env) para que estén disponibles
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Esto corrige el error de "módulo no encontrado" al usar @/
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Esto permite que tu código acceda a la API Key en producción
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    server: {
      port: 3000,
    },
  };
});