import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use / in dev for convenience, but /tomato/ in production (GitHub Pages project site)
  base: mode === 'production' ? '/tomato/' : '/',
}))
