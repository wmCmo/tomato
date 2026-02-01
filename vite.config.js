import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate', injectRegister: "auto", includeAssets: [
      'favicon.ico',
      'logo.svg',
      'pwa-64x64.png',
      'pwa-192x192.png',
      'pwa-512x512.png',
      'maskable-icon-512x512.png',
      'apple-touch-icon-180x180.png',
      'og.png',
      'manifest.webmanifest'
    ],
    devOptions: {
      enabled: true
    },
    workbox: {
      navigateFallbackDenylist: [/^\/tomato\/assets\//]
    }
  })],
  // Use / in dev for convenience, but /tomato/ in production (GitHub Pages project site)
  base: mode === 'production' ? '/tomato/' : '/',
}));
