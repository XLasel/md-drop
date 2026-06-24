import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      generateScopedName: (name, filename, css) => {
        const file = filename.split('?')[0]
        const component = path.basename(file, path.extname(file))
        const hash = createHash('sha256')
          .update(css)
          .digest('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .slice(0, 5)
        return `${component}_${name}_${hash}`
      },
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/app/styles/mixins" as *;`,
      },
    },
  },
})
