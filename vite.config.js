import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // PWA in dev can be noisy because the plugin uses a temporary `dev-dist/` folder
  // that often only contains the generated SW runtime files.
  // Opt-in to PWA during dev by setting `VITE_PWA_DEV=true`.
  const env = loadEnv(mode, process.cwd(), '');
  const enablePwaDev = env.VITE_PWA_DEV === 'true';

  return {
  // server: {
  //   allowedHosts: [
  //     '6526bcde958c.ngrok-free.app'
  //   ]
  // },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate', includeAssets: [
      'favicon.ico',
      'logo.svg',
      'pwa-64x64.png',
      'pwa-192x192.png',
      'pwa-512x512.png',
      'maskable-icon-512x512.png',
      'apple-touch-icon-180x180.png',
      'og.png',
    ],
    // Single source of truth for the manifest is `public/manifest.webmanifest`.
    // Without this, the plugin may generate/overwrite `dist/manifest.webmanifest`
    // from `package.json` (which can lead to the installed app name being slugified).
    manifest: false,
    devOptions: {
      enabled: enablePwaDev,
    },
    workbox: {
      navigateFallbackDenylist: [/^\/tomato\/assets\//]
    }
  })],
  // Use / in dev for convenience, but /tomato/ in production (GitHub Pages project site)
  base: mode === 'production' ? '/tomato/' : '/',
  };
});
