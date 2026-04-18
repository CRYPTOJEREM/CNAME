import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Optimisations de build
  build: {
    // Code splitting manuel pour optimiser le chargement
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - bibliothèques tierces
          'react-vendor': ['react', 'react-dom'],
          'axios-vendor': ['axios'],
          'icons': ['lucide-react']
        }
      }
    },

    // Optimiser la taille des chunks
    chunkSizeWarningLimit: 1000,

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer console.log en production
        drop_debugger: true
      }
    },

    // Source maps en production (optionnel, désactiver si non nécessaire)
    sourcemap: false
  },

  // Optimisations du serveur de dev
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },

  // Preview server config
  preview: {
    port: 4173,
    strictPort: true
  }
})
