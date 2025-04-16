
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Pre-bundle Leaflet to avoid import issues
    include: ['leaflet', 'lucide-react'],
  },
  build: {
    // Make sure CSS files from packages like Leaflet are included in the build
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet'],
        }
      }
    }
  },
  server: {
    port: 8080,
    host: "::"
  }
}));
