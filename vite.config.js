import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist'
  }
})
