import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Handle client-side routing - redirect all requests to index.html
    historyApiFallback: true,
  },
  build: {
    // Copy _redirects to dist for Netlify/Vercel deployments
    copyPublicDir: true,
  },
})