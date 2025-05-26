import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
    cors: true,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 5173,
    host: true,
    open: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      '@heroicons/react',
      'axios',
      'framer-motion',
    ],
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('http://localhost:3000/api'),
    'process.env.VITE_APP_NAME': JSON.stringify('Tripy Plan'),
    'process.env.VITE_NODE_ENV': JSON.stringify('development')
  }
}); 