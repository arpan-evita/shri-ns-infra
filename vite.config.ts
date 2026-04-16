import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - loads first, cached long-term
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Framer motion - heavy animation library
          'vendor-framer': ['framer-motion'],
          // Ant Design - very heavy UI library
          'vendor-antd': ['antd', '@ant-design/icons'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
          // Leaflet maps - only needed on property detail page
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          // Quill editor - only needed in admin
          'vendor-quill': ['react-quill-new'],
          // Lucide icons
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
  },
});
