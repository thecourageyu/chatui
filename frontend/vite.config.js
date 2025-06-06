import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow connections from external devices
    proxy: {  // this is a express api, you need to execute => node mongo_chat_history.js
      '/mongodb': {
        target: 'http://localhost:27018',
        changeOrigin: true,
        // rewrite: (path) => path.replace('^\/mongodb', '')  // optional
        rewrite: (path) => {
          console.log('Proxying (vite.config.js):', path)
          return path.replace(/^\/mongodb/, '')
          // return path.replace('^\/mongodb', '')
        },

      },
      '/v1': {
        target: 'http://vllm:8000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/v1/, '/v1')  // optional
        rewrite: (path) => {
          console.log('Original Path (vite.config.js):', path)
          console.log('Proxying (vite.config.js):', path.replace(/^\/v1/, ''))
          return path.replace(/^\/v1/, '/v1')
          // return path.replace('^\/mongodb', '')
        },
      },
    },
  },
})
