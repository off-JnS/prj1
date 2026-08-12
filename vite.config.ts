import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * The example sites under `public/beispiele/` are linked as directory URLs
 * (`/beispiele/elbzahn/`). Apache resolves those to `index.html` via
 * DirectoryIndex, but Vite's dev server does not — the request falls through
 * to the SPA and renders the 404 page. This rewrites directory requests to
 * their index.html so dev matches production.
 */
function publicDirectoryIndex(): Plugin {
  return {
    name: 'prj1-public-directory-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (url?.endsWith('/')) {
          const candidate = path.join(server.config.publicDir, url, 'index.html')
          if (fs.existsSync(candidate)) req.url = `${url}index.html`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), publicDirectoryIndex()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendors into separate cacheable chunks.
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-gsap': ['gsap', 'lenis'],
        },
      },
    },
  },
})
