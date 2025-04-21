import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  // Build optimizations
  build: {
    // Generate sourcemaps for debugging
    sourcemap: true,
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    
    // Optimize output chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          // Add more manual chunks as needed
        },
      },
    },
    
    // Enable HTTP/2 push preloading
    modulePreload: {
      polyfill: true,
    },
  },
  
  // Development server options
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    cors: true,
  },
  
  // Preview server for testing production builds
  preview: {
    port: 4173,
    strictPort: false,
    open: true,
  },
})
